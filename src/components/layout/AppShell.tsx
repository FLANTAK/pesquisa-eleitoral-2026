import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3, CalendarRange, ClipboardList, Database, FileBarChart, Gauge, LayoutDashboard,
  Map as MapIcon, Menu, Rows3, Settings, ShieldCheck, Target, Users, LogOut, RotateCcw,
} from "lucide-react";
import { EthosLogo } from "@/components/brand/EthosLogo";
import { BaseCard } from "@/components/panel/BaseCard";
import { ExportDialog } from "@/components/panel/ExportDialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useAnalysis } from "@/lib/analysis";
import { CONFIDENTIALITY_NOTE } from "@/lib/data/mock";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/components/panel/primitives";

const NAV = [
  { to: "/visao-geral", label: "Visão Geral", icon: LayoutDashboard, admin: false },
  { to: "/mapa", label: "Mapa de Rondônia", icon: MapIcon, admin: false },
  { to: "/evolucao", label: "Evolução por Período", icon: BarChart3, admin: false },
  { to: "/cruzamentos", label: "Cruzamentos", icon: Rows3, admin: false },
  { to: "/cenarios", label: "Cenários Eleitorais", icon: Target, admin: false },
  { to: "/avaliacao", label: "Avaliação de Governos", icon: Gauge, admin: false },
  { to: "/pautas", label: "Pautas e Prioridades", icon: ClipboardList, admin: false },
  { to: "/pesquisas", label: "Central de Pesquisas", icon: Database, admin: true },
  { to: "/questionarios", label: "Questionários", icon: FileBarChart, admin: true },
  { to: "/qualidade", label: "Qualidade dos Dados", icon: ShieldCheck, admin: true },
  { to: "/relatorios", label: "Relatórios e Exportações", icon: CalendarRange, admin: false },
  { to: "/clientes", label: "Clientes e Acessos", icon: Users, admin: true },
  { to: "/configuracoes", label: "Configurações", icon: Settings, admin: true },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-0.5">
      {NAV.filter((n) => !n.admin || isAdmin).map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors duration-200",
              active
                ? "bg-primary font-medium text-primary-foreground"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col bg-[color:var(--sidebar)] text-white">
      <div className="border-b border-[color:var(--sidebar-border)]/50 px-4 py-5">
        <EthosLogo />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="space-y-3 border-t border-[color:var(--sidebar-border)]/50 p-3">
        <BaseCard />
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <p className="truncate text-xs text-white/90">{user?.name}</p>
            <p className="truncate text-[10px] uppercase tracking-wide text-white/45">
              {user?.role === "admin" ? "Administrador" : "Cliente"}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Sair"
            className="h-8 w-8 text-white/60 hover:bg-white/10 hover:text-white"
            onClick={() => {
              signOut();
              navigate({ to: "/", replace: true });
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const { reset, base } = useAnalysis();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <Skeleton className="h-40 w-full max-w-md rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarContent />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Abrir menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-none p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-semibold text-foreground">
                  Pesquisas Rondônia
                </h1>
                <DemoBadge />
              </div>
              <p className="truncate text-xs text-muted-foreground">
                Painel de Inteligência Eleitoral · {user.organization}
              </p>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="hidden text-right md:block">
                <p className="text-xs font-medium text-foreground">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Última atualização: {base.updatedAt}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Limpar filtros
              </Button>
              <ExportDialog />
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 lg:p-6">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-[11px] text-muted-foreground lg:px-6">
          {CONFIDENTIALITY_NOTE}
        </footer>
      </div>
    </div>
  );
}