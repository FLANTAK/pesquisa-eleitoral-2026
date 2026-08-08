import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, RefreshCw, XCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, Panel } from "@/components/panel/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listKoboAssets, syncKoboAsset } from "@/lib/kobo.functions";

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

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function StatusBadge({ status, active }: { status: string; active: boolean }) {
  if (status === "deployed" && active)
    return (
      <Badge className="gap-1 bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15">
        <CheckCircle2 className="h-3 w-3" /> Publicado
      </Badge>
    );
  if (status === "archived")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" /> Arquivado
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1">
      <Clock className="h-3 w-3" /> Rascunho
    </Badge>
  );
}

interface LogEntry {
  id: string;
  uid: string;
  name: string;
  date: string;
  newRecords: number;
  duplicates: number;
  total: number;
  durationMs: number;
  status: "sucesso" | "parcial" | "falha";
  message: string;
}

function LogStatus({ status }: { status: LogEntry["status"] }) {
  const map: Record<LogEntry["status"], string> = {
    sucesso: "text-emerald-700",
    parcial: "text-amber-700",
    falha: "text-destructive",
  };
  return <span className={`font-medium capitalize ${map[status]}`}>{status}</span>;
}

function Page() {
  const fetchAssets = useServerFn(listKoboAssets);
  const runSync = useServerFn(syncKoboAsset);
  const assetsQuery = useQuery({ queryKey: ["kobo-assets"], queryFn: () => fetchAssets() });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [freqs, setFreqs] = useState<Record<string, string>>({});
  const [seenCount, setSeenCount] = useState<Record<string, number>>({});
  const [running, setRunning] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("todas");

  const assets = assetsQuery.data?.assets ?? [];
  const connectionError = assetsQuery.data?.ok === false ? assetsQuery.data.error : null;

  const visibleLogs = useMemo(
    () =>
      [...logs]
        .filter((l) => filter === "todas" || l.uid === filter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [logs, filter],
  );

  const totalNew = logs.reduce((s, l) => s + l.newRecords, 0);

  async function sync(uid: string, name: string) {
    setRunning(uid);
    const now = new Date().toISOString();
    try {
      const res = await runSync({ data: { uid } });
      if (!res.ok || !res.result) throw new Error(res.error ?? "Falha desconhecida");
      const r = res.result;
      const previous = seenCount[uid] ?? 0;
      const incremental = Math.max(0, r.fetched - previous);
      const duplicates = Math.min(previous, r.fetched) + r.duplicates;
      setSeenCount((prev) => ({ ...prev, [uid]: r.fetched }));
      const log: LogEntry = {
        id: `s${Date.now()}`,
        uid,
        name: r.name,
        date: now,
        newRecords: incremental,
        duplicates,
        total: r.total,
        durationMs: r.durationMs,
        status: duplicates > 0 && incremental === 0 ? "parcial" : "sucesso",
        message: `${r.fetched} registros lidos da API · ${incremental} novos nesta execução${
          duplicates ? `, ${duplicates} já importados` : ""
        } · última resposta em ${fmt(r.lastSubmission)}.`,
      };
      setLogs((prev) => [log, ...prev]);
      await assetsQuery.refetch();
      toast.success(`Sincronização concluída — ${r.name}`, { description: log.message });
    } catch (error) {
      const message = (error as Error).message;
      setLogs((prev) => [
        {
          id: `s${Date.now()}`,
          uid,
          name,
          date: now,
          newRecords: 0,
          duplicates: 0,
          total: 0,
          durationMs: 0,
          status: "falha",
          message,
        },
        ...prev,
      ]);
      toast.error(`Falha ao sincronizar ${name}`, { description: message });
    } finally {
      setRunning(null);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Integrações — KoboToolbox"
        subtitle="Conexão real com a API do KoboToolbox: formulários publicados, contagem de entrevistas e log de cada execução."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={assetsQuery.isFetching}
            onClick={() => void assetsQuery.refetch()}
          >
            <RefreshCw className={`h-4 w-4 ${assetsQuery.isFetching ? "animate-spin" : ""}`} />
            Atualizar formulários
          </Button>
        }
      />
      {connectionError ? (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Não foi possível consultar a API do KoboToolbox: {connectionError}</span>
        </div>
      ) : null}
      <Panel
        title="Formulários na conta conectada"
        description="Dados obtidos em tempo real de kf.kobotoolbox.org com o token institucional armazenado no servidor."
      >
        {assetsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Consultando a API do KoboToolbox…</p>
        ) : null}
        {!assetsQuery.isLoading && assets.length === 0 && !connectionError ? (
          <p className="text-sm text-muted-foreground">Nenhum formulário encontrado nesta conta.</p>
        ) : null}
        <div className="space-y-3">
          {assets.map((i) => (
            <div
              key={i.uid}
              className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-secondary/40 p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{i.name}</p>
                  <StatusBadge status={i.status} active={i.active} />
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  conta {i.owner} · formulário {i.uid} · {i.questionCount} perguntas
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {i.submissionCount.toLocaleString("pt-BR")} entrevistas no Kobo · última resposta:{" "}
                  {fmt(i.lastSubmission)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={freqs[i.uid] ?? "Manual"}
                  onValueChange={(v) => setFreqs((prev) => ({ ...prev, [i.uid]: v }))}
                >
                  <SelectTrigger className="h-9 w-56 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((f) => (
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
                  onClick={() => void sync(i.uid, i.name)}
                >
                  {running === i.uid ? (
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
        description={`${logs.length} execuções nesta sessão · ${totalNew.toLocaleString("pt-BR")} entrevistas novas importadas.`}
        actions={
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-56 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas" className="text-xs">
                Todas as conexões
              </SelectItem>
              {assets.map((i) => (
                <SelectItem key={i.uid} value={i.uid} className="text-xs">
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {logs.length === 0 ? (
          <p className="mb-3 text-xs text-muted-foreground">
            Nenhuma execução ainda. Use “Sincronizar agora” para importar da API.
          </p>
        ) : null}
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Data</th>
                <th className="px-3 py-2 font-medium">Conexão</th>
                <th className="px-3 py-2 font-medium">Novas</th>
                <th className="px-3 py-2 font-medium">Duplicadas</th>
                <th className="px-3 py-2 font-medium">Tempo</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((l) => (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums">{fmt(l.date)}</td>
                  <td className="px-3 py-2">{l.name}</td>
                  <td className="px-3 py-2 tabular-nums">{l.newRecords}</td>
                  <td className="px-3 py-2 tabular-nums">{l.duplicates}</td>
                  <td className="px-3 py-2 tabular-nums">{(l.durationMs / 1000).toFixed(1)}s</td>
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