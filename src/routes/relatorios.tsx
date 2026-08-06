import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Painel Ethos" },
      { name: "description", content: "Geração e histórico de relatórios institucionais." },
      { property: "og:title", content: "Relatórios — Painel Ethos" },
      { property: "og:description", content: "Geração e histórico de relatórios institucionais." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Relatórios" subtitle="Geração e histórico de relatórios institucionais." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
