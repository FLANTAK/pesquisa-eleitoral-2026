import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/questionarios")({
  head: () => ({
    meta: [
      { title: "Questionários — Painel Ethos" },
      { name: "description", content: "Estrutura de perguntas, blocos e mapeamento de variáveis." },
      { property: "og:title", content: "Questionários — Painel Ethos" },
      { property: "og:description", content: "Estrutura de perguntas, blocos e mapeamento de variáveis." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Questionários" subtitle="Estrutura de perguntas, blocos e mapeamento de variáveis." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
