import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ModeSelector } from "@/components/panel/ModeSelector";
import { EmptyState, PageHeader, Panel, SmallBaseAlert } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";
import { cn } from "@/lib/utils";
import {
  CANDIDATES, EVALUATION_LABELS, PRIORITIES, VARIABLE_LABELS, aggregateVote, crosstab,
  governmentEvaluation, priorityRanking, type ProfileVariable,
} from "@/lib/data/mock";

export const Route = createFileRoute("/cruzamentos")({
  head: () => ({
    meta: [
      { title: "Cruzamentos Demográficos — Painel Ethos" },
      { name: "description", content: "Intenção de voto por sexo, faixa etária, renda, escolaridade e religião." },
      { property: "og:title", content: "Cruzamentos Demográficos — Painel Ethos" },
      { property: "og:description", content: "Intenção de voto por sexo, faixa etária, renda, escolaridade e religião." },
    ],
  }),
  component: Page,
});

const VARIABLES: ProfileVariable[] = [
  "sexo", "idade", "renda", "escolaridade", "religiao", "zona", "posicionamento", "regiao", "municipio", "periodo",
];

const QUESTIONS = [
  { id: "voto", label: "Intenção de voto (estimulada)" },
  { id: "avaliacao", label: "Avaliação de governo" },
  { id: "prioridades", label: "Prioridades de governo" },
] as const;

type QuestionId = (typeof QUESTIONS)[number]["id"];

const colorFor = (label: string) =>
  CANDIDATES.find((c) => c.ballotName === label)?.color ?? "var(--gold)";

function Chips<T extends string>({
  options, value, onChange,
}: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200",
            value === o.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Page() {
  const { activeSurveys, base } = useAnalysis();
  const [question, setQuestion] = useState<QuestionId>("voto");
  const [variable, setVariable] = useState<ProfileVariable>("sexo");

  const rows = useMemo(() => {
    if (question === "avaliacao") return EVALUATION_LABELS;
    if (question === "prioridades") return PRIORITIES;
    return aggregateVote(activeSurveys, base.method).map((d) => d.label);
  }, [question, activeSurveys, base.method]);

  const totals = useMemo(() => {
    if (question === "avaliacao") return governmentEvaluation(activeSurveys);
    if (question === "prioridades") return priorityRanking(activeSurveys);
    return aggregateVote(activeSurveys, base.method);
  }, [question, activeSurveys, base.method]);

  const table = useMemo(
    () => crosstab(activeSurveys, rows, variable, base.method),
    [activeSurveys, rows, variable, base.method],
  );

  const maxCell = Math.max(...table.cells.flat(), 1);
  const totalOf = (r: string) => totals.find((t) => t.label === r)?.value ?? 0;

  return (
    <AppShell>
      <PageHeader
        title="Cruzamentos Demográficos"
        subtitle={`Base ponderada: ${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}
      />
      <ModeSelector />

      {!activeSurveys.length ? (
        <EmptyState
          title="Nenhuma pesquisa corresponde aos filtros selecionados."
          description="Ajuste o modo de análise ou selecione municípios no mapa para montar a tabela cruzada."
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Chips options={QUESTIONS.map((q) => ({ id: q.id, label: q.label }))} value={question} onChange={setQuestion} />
            <Chips
              options={VARIABLES.map((v) => ({ id: v, label: VARIABLE_LABELS[v] }))}
              value={variable}
              onChange={setVariable}
            />
          </div>

          <Panel
            title={`Tabela cruzada — ${VARIABLE_LABELS[variable]}`}
            description="Percentual por coluna. Cada coluna soma 100% dentro do respectivo segmento."
            hint="Os valores usam a mesma ponderação da Visão Geral. Colunas com base reduzida aparecem sinalizadas."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="sticky left-0 bg-card px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Resposta
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Total
                    </th>
                    {table.columns.map((c, i) => (
                      <th key={c} className="px-3 py-2 text-right text-xs font-semibold text-foreground">
                        <span className="block truncate">{c}</span>
                        <span className={cn("block text-[10px] font-normal", table.colBases[i]! < 30 ? "text-destructive" : "text-muted-foreground")}>
                          n={table.colBases[i]}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((r, ri) => (
                    <tr key={r} className="border-b border-border/60 last:border-0">
                      <td className="sticky left-0 bg-card px-3 py-2">
                        <span className="flex items-center gap-2 text-foreground">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colorFor(r) }} />
                          <span className="truncate">{r}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums text-foreground">
                        {totalOf(r).toFixed(1)}%
                      </td>
                      {table.cells[ri]!.map((v, ci) => {
                        const diff = v - totalOf(r);
                        return (
                          <td
                            key={ci}
                            className="px-3 py-2 text-right tabular-nums text-foreground"
                            style={{ backgroundColor: `color-mix(in srgb, var(--gold) ${(v / maxCell) * 26}%, transparent)` }}
                            title={`${v.toFixed(1)}% (${diff > 0 ? "+" : ""}${diff.toFixed(1)} p.p. vs total)`}
                          >
                            {v.toFixed(1)}%
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SmallBaseAlert base={Math.min(...table.colBases)} />
          </Panel>

          <Panel
            title="Destaques por segmento"
            description="Maiores diferenças em pontos percentuais frente ao resultado total."
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {table.columns
                .map((c, ci) => {
                  let bestRow = table.rows[0] ?? "—";
                  let bestDiff = -Infinity;
                  table.rows.forEach((r, ri) => {
                    const d = (table.cells[ri]?.[ci] ?? 0) - totalOf(r);
                    if (d > bestDiff) { bestDiff = d; bestRow = r; }
                  });
                  return { c, bestRow, bestDiff };
                })
                .sort((a, b) => b.bestDiff - a.bestDiff)
                .slice(0, 6)
                .map((h) => (
                  <li key={h.c} className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm">
                    <span className="font-medium text-foreground">{h.c}</span>
                    <span className="text-muted-foreground"> — destaque para </span>
                    <span className="font-medium text-foreground">{h.bestRow}</span>
                    <span className="ml-1 tabular-nums text-[color:var(--warning)]">
                      +{h.bestDiff.toFixed(1)} p.p.
                    </span>
                  </li>
                ))}
            </ul>
          </Panel>
        </>
      )}
    </AppShell>
  );
}
