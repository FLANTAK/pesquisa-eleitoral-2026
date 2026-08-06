import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { RondoniaMap } from "@/components/panel/RondoniaMap";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnalysis } from "@/lib/analysis";
import { MUNICIPALITIES, SURVEYS, municipalityByIbge } from "@/lib/data/mock";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de Rondônia — Painel Ethos" },
      { name: "description", content: "Seleção de municípios de Rondônia no mapa e geração do fechamento ponderado da área." },
      { property: "og:title", content: "Mapa de Rondônia — Painel Ethos" },
      { property: "og:description", content: "Seleção municipal e fechamento ponderado da área." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [search, setSearch] = useState("");
  const { selectedMunicipalities, setSelectedMunicipalities, base } = useAnalysis();
  const selected = selectedMunicipalities.map((i) => municipalityByIbge(i)).filter(Boolean);
  const surveysInArea = SURVEYS.filter(
    (s) => !selectedMunicipalities.length || selectedMunicipalities.includes(s.municipalityIbge),
  );

  return (
    <AppShell>
      <PageHeader
        title="Mapa de Rondônia"
        subtitle="Clique para selecionar municípios. Clique novamente para remover."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedMunicipalities(MUNICIPALITIES.map((m) => m.ibge))}>
              Selecionar todos com dados
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedMunicipalities([])}>
              Limpar seleção
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Panel title="Limites municipais" description="Malha oficial IBGE — 52 municípios">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar município por nome"
            className="mb-3 h-9 max-w-xs"
          />
          <RondoniaMap search={search} />
        </Panel>

        <div className="space-y-4">
          <Panel title="Área selecionada">
            <dl className="space-y-2 text-sm">
              <Row label="Municípios selecionados" value={String(selectedMunicipalities.length || "Todos")} />
              <Row label="Pesquisas disponíveis" value={String(surveysInArea.length)} />
              <Row label="Entrevistas" value={surveysInArea.reduce((a, s) => a + s.interviews, 0).toLocaleString("pt-BR")} />
              <Row label="Período abrangido" value={base.period} />
              <Row label="Ponderação ativa" value={base.weighting} />
            </dl>
            <Button
              className="mt-4 w-full"
              onClick={() =>
                toast.success("Fechamento da área gerado.", {
                  description: "Todos os gráficos passaram a considerar apenas os municípios selecionados.",
                })
              }
            >
              GERAR FECHAMENTO DA ÁREA
            </Button>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Revise as pesquisas e a regra de ponderação antes de gerar o fechamento.
            </p>
          </Panel>

          <Panel title="Municípios da seleção">
            {selected.length ? (
              <ul className="max-h-72 space-y-1 overflow-y-auto text-sm">
                {selected.map((m) => (
                  <li key={m!.ibge} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span>{m!.name}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {SURVEYS.filter((s) => s.municipalityIbge === m!.ibge).reduce((a, s) => a + s.interviews, 0)} entrevistas
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Nenhum município selecionado"
                description="Sem seleção, a análise considera todos os municípios com dados disponíveis."
              />
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium tabular-nums text-foreground">{value}</dd>
    </div>
  );
}