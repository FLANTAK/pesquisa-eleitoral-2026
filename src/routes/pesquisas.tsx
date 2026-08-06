import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/pesquisas")({
  head: () => ({
    meta: [
      { title: "Central de Pesquisas — Painel Ethos" },
      { name: "description", content: "Importação CSV/KoboToolbox e gestão das bases de pesquisa." },
      { property: "og:title", content: "Central de Pesquisas — Painel Ethos" },
      { property: "og:description", content: "Importação CSV/KoboToolbox e gestão das bases de pesquisa." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Central de Pesquisas" subtitle="Importação CSV/KoboToolbox e gestão das bases de pesquisa." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
