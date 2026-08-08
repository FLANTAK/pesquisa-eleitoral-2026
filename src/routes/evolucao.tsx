import { createFileRoute } from "@tanstack/react-router";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, Panel, StatCard, TrendPill } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";
import { CANDIDATES, SURVEYS, aggregateVote, evolutionSeries } from "@/lib/data/mock";

export const Route = createFileRoute("/evolucao")({
  head: () => ({
    meta: [
      { title: "Evolução por Período — Painel Ethos" },
      { name: "description", content: "Acompanhamento temporal da intenção de voto, rejeição e avaliação entre as ondas de pesquisa." },
      { property: "og:title", content: "Evolução por Período — Painel Ethos" },
      { property: "og:description", content: "Séries temporais das pesquisas eleitorais de Rondônia." },
    ],
  }),
  component: EvolutionPage,
});

function EvolutionPage() {
  const { base } = useAnalysis();
  const all = SURVEYS.filter((s) => s.status === "publicada");
  const series = evolutionSeries(all);
  const govs = CANDIDATES.filter((c) => c.office === "governador");
  const last = series.at(-1);
  const prev = series.at(-2);
  const scenariosDiffer = new Set(all.map((s) => s.scenarioKey)).size > 1;
  const current = aggregateVote(all.filter((s) => s.wave === 3), base.method);

  return (
    <AppShell>
      <PageHeader title="Evolução por Período" subtitle="Intenção estimulada para governador, por onda de campo" />

      {scenariosDiffer && (
        <p className="rounded-md border border-[color:var(--warning)]/30 bg-[color:var(--gold-soft)] px-4 py-3 text-xs text-[color:var(--warning)]">
          A composição deste cenário foi alterada entre as pesquisas selecionadas. A comparação deve
          considerar essa diferença.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {govs.slice(0, 4).map((c) => {
          const now = (last?.[c.ballotName] as number) ?? 0;
          const before = (prev?.[c.ballotName] as number) ?? now;
          return (
            <StatCard
              key={c.id}
              label={c.ballotName}
              value={`${now.toFixed(1)}%`}
              detail={`Anterior ${before.toFixed(1)}%`}
              trend={Math.round((now - before) * 10) / 10}
            />
          );
        })}
      </div>

      <Panel title="Gráfico de evolução" description="Cada ponto considera as pesquisas da onda, com ponderação ativa">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ left: -16, right: 12, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
              <RTooltip
                formatter={(v: number, n: string) => [`${v}%`, n]}
                labelFormatter={(l: string) => {
                  const p = series.find((x) => x["periodo"] === l);
                  return `${l} · ${p?.["entrevistas"]} entrevistas · ${p?.["cenario"]}`;
                }}
              />
              {govs.map((c) => (
                <Line key={c.id} type="monotone" dataKey={c.ballotName} stroke={c.color} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Indicadores do período" description="Comparação entre a onda atual e a anterior">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="py-2 font-medium">Candidato</th>
                <th className="py-2 font-medium">Atual</th>
                <th className="py-2 font-medium">Anterior</th>
                <th className="py-2 font-medium">Variação</th>
                <th className="py-2 font-medium">Maior no período</th>
                <th className="py-2 font-medium">Menor no período</th>
              </tr>
            </thead>
            <tbody>
              {govs.map((c) => {
                const vals = series.map((p) => (p[c.ballotName] as number) ?? 0);
                const now = vals.at(-1) ?? 0;
                const before = vals.at(-2) ?? now;
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="py-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.ballotName} <span className="text-xs text-muted-foreground">({c.party})</span>
                      </span>
                    </td>
                    <td className="py-2 tabular-nums">{now.toFixed(1)}%</td>
                    <td className="py-2 tabular-nums">{before.toFixed(1)}%</td>
                    <td className="py-2"><TrendPill value={Math.round((now - before) * 10) / 10} /></td>
                    <td className="py-2 tabular-nums">{Math.max(...vals).toFixed(1)}%</td>
                    <td className="py-2 tabular-nums">{Math.min(...vals).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Indecisos na última onda: {current.find((v) => v.label === "Indeciso")?.value ?? 0}% · Branco/Nulo:{" "}
          {current.find((v) => v.label === "Branco/Nulo")?.value ?? 0}%.
        </p>
      </Panel>
    </AppShell>
  );
}