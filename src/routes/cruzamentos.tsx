import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

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

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Cruzamentos Demográficos" subtitle="Intenção de voto por sexo, faixa etária, renda, escolaridade e religião." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
