import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, RefreshCw, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, Panel, DemoBadge } from "@/components/panel/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KOBO_INTEGRATIONS, SYNC_LOGS } from "@/lib/data/mock";
import type { KoboIntegration, SyncLog } from "@/lib/types";

export const Route = createFileRoute("/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações KoboToolbox — Painel Ethos" },
      {
        name: "description",
        content:
          "Sincronização de entrevistas do KoboToolbox e histórico de logs de cada importação.",
      },
      { property: "og:title", content: "Integrações KoboToolbox — Painel Ethos" },
      {
        property: "og:description",
        content: "Sincronização de entrevistas do KoboToolbox e histórico de logs de cada importação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const FREQUENCIES = ["Manual", "A cada 6 horas (preparado)", "Diária (preparado)"];

function fmt(dt: string) {
  return new Date(dt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function StatusBadge({ status }: { status: KoboIntegration["status"] }) {
  if (status === "conectado")
    return (
      <Badge className="gap-1 bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15">
        <CheckCircle2 className="h-3 w-3" /> Conectado
      </Badge>
    );
  if (status === "erro")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" /> Erro
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1">
      <Clock className="h-3 w-3" /> Não configurado
    </Badge>
  );
}

function LogStatus({ status }: { status: SyncLog["status"] }) {
  const map: Record<SyncLog["status"], string> = {
    sucesso: "text-emerald-700",
    parcial: "text-amber-700",
    falha: "text-destructive",
  };
  return <span className={`font-medium capitalize ${map[status]}`}>{status}</span>;
}

function Page() {
  const [integrations, setIntegrations] = useState<KoboIntegration[]>(() =>
    KOBO_INTEGRATIONS.map((i) => ({ ...i })),
  );
  const [logs, setLogs] = useState<SyncLog[]>(() => [...SYNC_LOGS]);
  const [auto, setAuto] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("todas");

  const visibleLogs = useMemo(
    () =>
      [...logs]
        .filter((l) => filter === "todas" || l.integrationId === filter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [logs, filter],
  );

  const totalNew = logs.reduce((s, l) => s + l.newRecords, 0);

  async function sync(integration: KoboIntegration) {
    setRunning(integration.id);
    await new Promise((r) => setTimeout(r, 1400));
    const failed = integration.status === "erro";
    const now = new Date().toISOString();
    const newRecords = failed ? 0 : 40 + Math.floor(Math.random() * 120);
    const duplicates = failed ? 0 : Math.floor(Math.random() * 8);
    const log: SyncLog = {
      id: `s${Date.now()}`,
      integrationId: integration.id,
      date: now,
      newRecords,
      duplicates,
      status: failed ? "falha" : duplicates > 0 ? "parcial" : "sucesso",
      message: failed
        ? "Token inválido ou expirado. Verifique as credenciais do servidor Kobo."
        : `${newRecords} entrevistas importadas${duplicates ? `, ${duplicates} duplicadas ignoradas` : ""}.`,
    };
    setLogs((prev) => [log, ...prev]);
    setIntegrations((prev) =>
      prev.map((i) => (i.id === integration.id ? { ...i, lastSync: now } : i)),
    );
    setRunning(null);
    if (failed) toast.error(`Falha ao sincronizar ${integration.name}`, { description: log.message });
    else toast.success(`Sincronização concluída — ${integration.name}`, { description: log.message });
  }

  return (
    <AppShell>
      <PageHeader
        title="Integrações — KoboToolbox"
        subtitle="Sincronize entrevistas de campo automaticamente e acompanhe o log de cada execução."
        actions={<DemoBadge />}
      />
      <Panel
        title="Conexões configuradas"
        description="Cada conexão aponta para um formulário do KoboToolbox vinculado a um cliente."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sincronização automática</span>
            <Switch
              checked={auto}
              onCheckedChange={(v) => {
                setAuto(v);
                toast.info(
                  v
                    ? "Sincronização automática ativada (simulada nesta demonstração)."
                    : "Sincronização automática desativada.",
                );
              }}
              aria-label="Ativar sincronização automática"
            />
          </div>
        }
      >
        <div className="space-y-3">
          {integrations.map((i) => (
            <div
              key={i.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-secondary/40 p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{i.name}</p>
                  <StatusBadge status={i.status} />
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {i.serverUrl} · projeto {i.projectId} · formulário {i.formId} · token {i.tokenMask}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Última sincronização: {fmt(i.lastSync)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={i.frequency}
                  onValueChange={(v) =>
                    setIntegrations((prev) =>
                      prev.map((x) => (x.id === i.id ? { ...x, frequency: v } : x)),
                    )
                  }
                >
                  <SelectTrigger className="h-9 w-56 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set([i.frequency, ...FREQUENCIES])].map((f) => (
                      <SelectItem key={f} value={f} className="text-xs">
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={running !== null}
                  onClick={() => void sync(i)}
                >
                  {running === i.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Sincronizar agora
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel
        title="Histórico de sincronizações"
        description={`${logs.length} execuções registradas · ${totalNew.toLocaleString("pt-BR")} entrevistas importadas no total.`}
        actions={
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-56 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas" className="text-xs">
                Todas as conexões
              </SelectItem>
              {integrations.map((i) => (
                <SelectItem key={i.id} value={i.id} className="text-xs">
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Data</th>
                <th className="px-3 py-2 font-medium">Conexão</th>
                <th className="px-3 py-2 font-medium">Novas</th>
                <th className="px-3 py-2 font-medium">Duplicadas</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((l) => (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums">{fmt(l.date)}</td>
                  <td className="px-3 py-2">
                    {integrations.find((i) => i.id === l.integrationId)?.name ?? l.integrationId}
                  </td>
                  <td className="px-3 py-2 tabular-nums">{l.newRecords}</td>
                  <td className="px-3 py-2 tabular-nums">{l.duplicates}</td>
                  <td className="px-3 py-2">
                    <LogStatus status={l.status} />
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}