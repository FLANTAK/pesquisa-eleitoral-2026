import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/qualidade")({
  head: () => ({
    meta: [
      { title: "Qualidade da Amostra — Painel Ethos" },
      { name: "description", content: "Consistência, ponderação e auditoria dos dados coletados." },
      { property: "og:title", content: "Qualidade da Amostra — Painel Ethos" },
      { property: "og:description", content: "Consistência, ponderação e auditoria dos dados coletados." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Qualidade da Amostra" subtitle="Consistência, ponderação e auditoria dos dados coletados." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
