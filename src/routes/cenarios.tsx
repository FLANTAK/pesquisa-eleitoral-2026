import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/cenarios")({
  head: () => ({
    meta: [
      { title: "Cenários Eleitorais — Painel Ethos" },
      { name: "description", content: "Comparação entre cenários estimulados e espontâneos por cargo." },
      { property: "og:title", content: "Cenários Eleitorais — Painel Ethos" },
      { property: "og:description", content: "Comparação entre cenários estimulados e espontâneos por cargo." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Cenários Eleitorais" subtitle="Comparação entre cenários estimulados e espontâneos por cargo." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
