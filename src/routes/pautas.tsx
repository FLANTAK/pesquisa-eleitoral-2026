import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/pautas")({
  head: () => ({
    meta: [
      { title: "Pautas e Temas — Painel Ethos" },
      { name: "description", content: "Principais problemas e prioridades apontados pelos eleitores." },
      { property: "og:title", content: "Pautas e Temas — Painel Ethos" },
      { property: "og:description", content: "Principais problemas e prioridades apontados pelos eleitores." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Pautas e Temas" subtitle="Principais problemas e prioridades apontados pelos eleitores." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
