import { createFileRoute } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import {
  CalendarDays, Layers, MapPin, Percent, Target, Users, Gauge, RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ModeSelector } from "@/components/panel/ModeSelector";
import { BarList, EmptyState, Panel, PageHeader, StatCard, TrendPill } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";
import {
  CANDIDATES, EVALUATION_LABELS, MUNICIPALITIES, aggregateVote, approval, evolutionSeries,
  governmentEvaluation, municipalityByIbge, profileDistribution,
} from "@/lib/data/mock";

export const Route = createFileRoute("/visao-geral")({
  head: () => ({
    meta: [
      { title: "Visão Geral — Painel de Inteligência Eleitoral | Ethos" },
      { name: "description", content: "Indicadores consolidados, perfil do eleitor, cenário eleitoral e avaliação de governo em Rondônia." },
      { property: "og:title", content: "Visão Geral — Painel de Inteligência Eleitoral | Ethos" },
      { property: "og:description", content: "Indicadores consolidados das pesquisas eleitorais de Rondônia." },
    ],
  }),
  component: Overview,
});

const colorFor = (label: string) =>
  CANDIDATES.find((c) => c.ballotName === label)?.color ??
  (label === "Indeciso" ? "#B8B5AE" : label === "Branco/Nulo" ? "#66645F" : "var(--gold-light)");

function Overview() {
  const { activeSurveys, base, weightingId } = useAnalysis();
  const vote = aggregateVote(activeSurveys, base.method);
  const series = evolutionSeries(activeSurveys);
  const evalDist = governmentEvaluation(activeSurveys);
  const ap = approval(activeSurveys);
  const validos = vote.filter((v) => !["Branco/Nulo", "Indeciso"].includes(v.label));
  const validSum = validos.reduce((a, v) => a + v.value, 0) || 1;

  const cities = MUNICIPALITIES.map((m) => {
    const abs = activeSurveys
      .filter((s) => s.municipalityIbge === m.ibge)
      .reduce((a, s) => a + s.interviews, 0);
    return { label: m.name, abs, value: base.interviews ? (abs / base.interviews) * 100 : 0 };
  })
    .filter((c) => c.abs > 0)
    .sort((a, b) => b.abs - a.abs);

  const leader = vote[0];
  const prev = series.length > 1 ? series[series.length - 2] : undefined;
  const trend =
    leader && prev && typeof prev[leader.label] === "number"
      ? leader.value - (prev[leader.label] as number)
      : 0;

  return (
    <AppShell>
      <PageHeader
        title="Visão Geral"
        subtitle={`Base de referência: ${base.period} · ponderação ${base.weighting}`}
      />
      <ModeSelector />

      {!activeSurveys.length ? (
        <EmptyState
          title="Nenhuma pesquisa corresponde aos filtros selecionados."
          description="Ajuste o modo de análise, os municípios do mapa ou selecione pesquisas na Central de Pesquisas."
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Entrevistas" value={base.interviews.toLocaleString("pt-BR")} icon={Users} detail="Total ponderável" />
            <StatCard label="Municípios" value={base.municipalities} icon={MapPin} detail="Na área analisada" />
            <StatCard label="Período" value={base.period} icon={CalendarDays} />
            <StatCard label="Margem de erro" value={`± ${base.marginOfError} p.p.`} icon={Percent} detail={`Confiança ${base.confidence}%`} />
            <StatCard label="Universo eleitoral" value={base.universe.toLocaleString("pt-BR")} icon={Target} />
            <StatCard label="Pesquisas incluídas" value={base.surveys} icon={Layers} detail={base.questionnaires} />
            <StatCard label="Aprovação do governo" value={`${ap.aprova}%`} icon={Gauge} detail={`Desaprova ${ap.desaprova}%`} />
            <StatCard label="Última sincronização" value={base.updatedAt} icon={RefreshCw} detail="KoboToolbox" />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Panel
              title="Cenário eleitoral principal"
              description={`Governador · ${activeSurveys[0]?.scenarioKey ?? "—"} · intenção estimulada`}
              className="xl:col-span-2"
              hint="Percentuais sobre o total de entrevistas ponderadas. Branco, nulo e indecisos permanecem visíveis."
            >
              <BarList data={vote} colorFor={colorFor} />
              <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
                <MiniStat label="Votos totais" value={`${vote.reduce((a, v) => a + v.value, 0).toFixed(0)}%`} />
                <MiniStat label="Votos válidos (líder)" value={`${leader ? ((leader.value / validSum) * 100).toFixed(1) : "0"}%`} />
                <MiniStat label="Respostas válidas" value={validos.reduce((a, v) => a + v.abs, 0).toLocaleString("pt-BR")} />
              </div>
            </Panel>

            <Panel title="Perfil do eleitor" description="Distribuição da amostra ponderada">
              <div className="grid gap-4">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={profileDistribution(activeSurveys, "sexo")}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={38}
                        outerRadius={62}
                        paddingAngle={2}
                        isAnimationActive={false}
                      >
                        {profileDistribution(activeSurveys, "sexo").map((_, i) => (
                          <Cell key={i} fill={i === 0 ? "var(--ink-2)" : "var(--gold)"} />
                        ))}
                      </Pie>
                      <RTooltip formatter={(v: number) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <BarList data={profileDistribution(activeSurveys, "idade")} showAbs={false} />
              </div>
            </Panel>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {(["renda", "escolaridade"] as const).map((v) => (
              <Panel key={v} title={v === "renda" ? "Renda familiar" : "Escolaridade"}>
                <BarList data={profileDistribution(activeSurveys, v)} />
              </Panel>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Panel
              title="Evolução"
              description="Intenção de voto estimulada por onda"
              className="xl:col-span-2"
              actions={leader ? <TrendPill value={trend} /> : undefined}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="periodo" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
                    <RTooltip formatter={(v: number) => `${v}%`} />
                    {CANDIDATES.filter((c) => c.office === "governador").map((c) => (
                      <Line
                        key={c.id}
                        type="monotone"
                        dataKey={c.ballotName}
                        stroke={c.color}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Avaliação de governo" description="Governo do estado">
              <BarList data={evalDist} showAbs={false} />
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                <MiniStat label="Aprova" value={`${ap.aprova}%`} />
                <MiniStat label="Desaprova" value={`${ap.desaprova}%`} />
                <MiniStat label="NS/NR" value={`${ap.nsnr}%`} />
              </div>
            </Panel>
          </div>

          <Panel title="Cidades entrevistadas" description="Distribuição da amostra por município">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cities} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <RTooltip formatter={(v: number, _n, p) => [`${v} entrevistas`, p.payload.label]} />
                  <Bar dataKey="abs" fill="var(--gold)" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Modelo de ponderação ativo: {base.weighting} ({weightingId}). Percentuais nunca são
              obtidos por média simples entre municípios.
            </p>
          </Panel>

          <Panel title="Evolução resumida por onda" description="Entrevistas e cenários utilizados">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-2 font-medium">Período</th>
                    <th className="py-2 font-medium">Entrevistas</th>
                    <th className="py-2 font-medium">Cenário</th>
                    {CANDIDATES.filter((c) => c.office === "governador").map((c) => (
                      <th key={c.id} className="py-2 font-medium">{c.ballotName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {series.map((p) => (
                    <tr key={String(p["periodo"])} className="border-t border-border">
                      <td className="py-2">{String(p["periodo"])}</td>
                      <td className="py-2 tabular-nums">{String(p["entrevistas"])}</td>
                      <td className="py-2">{String(p["cenario"])}</td>
                      {CANDIDATES.filter((c) => c.office === "governador").map((c) => (
                        <td key={c.id} className="py-2 tabular-nums">
                          {typeof p[c.ballotName] === "number" ? `${p[c.ballotName]}%` : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <p className="text-[11px] text-muted-foreground">
            Municípios na base: {activeSurveys.map((s) => municipalityByIbge(s.municipalityIbge)?.name).filter((v, i, a) => a.indexOf(v) === i).join(", ")}.
            Categorias {EVALUATION_LABELS.join(", ")} sempre exibidas integralmente.
          </p>
        </>
      )}
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}