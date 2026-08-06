import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, PageHeader, Panel } from "@/components/panel/primitives";
import { useAnalysis } from "@/lib/analysis";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes e Acessos — Painel Ethos" },
      { name: "description", content: "Gestão de usuários, papéis e permissões de acesso." },
      { property: "og:title", content: "Clientes e Acessos — Painel Ethos" },
      { property: "og:description", content: "Gestão de usuários, papéis e permissões de acesso." },
    ],
  }),
  component: Page,
});

function Page() {
  const { base } = useAnalysis();
  return (
    <AppShell>
      <PageHeader title="Clientes e Acessos" subtitle="Gestão de usuários, papéis e permissões de acesso." />
      <Panel title="Base ativa" description={`${base.surveys} pesquisas · ${base.interviews.toLocaleString("pt-BR")} entrevistas · ${base.period}`}>
        <EmptyState
          title="Módulo em preparação"
          description="Esta seção será habilitada na próxima etapa de implementação, usando a mesma base ponderada da Visão Geral."
        />
      </Panel>
    </AppShell>
  );
}
