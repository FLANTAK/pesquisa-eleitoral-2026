import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/avaliacao")({
  head: () => ({
    meta: [
      { title: "Avaliação de Governo — Painel Ethos" },
      { name: "description", content: "Aprovação, desaprovação e avaliação qualitativa das gestões." },
      { property: "og:title", content: "Avaliação de Governo — Painel Ethos" },
      { property: "og:description", content: "Aprovação, desaprovação e avaliação qualitativa das gestões." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Avaliação de Governo" subtitle="Aprovação, desaprovação e avaliação qualitativa das gestões." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
