import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Distribution } from "@/lib/types";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  hint,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <section className={cn("panel p-5", className)}>
      {(title || actions) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                {title}
                {hint && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">{hint}</TooltipContent>
                  </Tooltip>
                )}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number;
}) {
  return (
    <div className="panel flex flex-col gap-1 p-4 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.09em] text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <span className="text-2xl font-semibold tabular-nums text-foreground">{value}</span>
      <div className="flex items-center gap-2">
        {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
        {trend !== undefined && <TrendPill value={trend} />}
      </div>
    </div>
  );
}

export function TrendPill({ value }: { value: number }) {
  const stable = Math.abs(value) < 0.5;
  const Icon = stable ? Minus : value > 0 ? TrendingUp : TrendingDown;
  const color = stable
    ? "text-muted-foreground"
    : value > 0
      ? "text-[color:var(--success)]"
      : "text-destructive";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium tabular-nums", color)}>
      <Icon className="h-3.5 w-3.5" />
      {value > 0 ? "+" : ""}
      {value.toFixed(1)} p.p.
    </span>
  );
}

export function BarList({
  data,
  showAbs = true,
  colorFor,
}: {
  data: Distribution[];
  showAbs?: boolean;
  colorFor?: (label: string) => string | undefined;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-2.5">
      {data.map((d) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-foreground">{d.label}</span>
            <span className="tabular-nums font-medium text-foreground">
              {d.value.toFixed(1)}%
              {showAbs && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">n={d.abs}</span>
              )}
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: colorFor?.(d.label) ?? "var(--gold)",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SmallBaseAlert({ base, limit = 30 }: { base: number; limit?: number }) {
  if (base >= limit) return null;
  return (
    <p className="mt-3 rounded-md border border-[color:var(--warning)]/30 bg-[color:var(--gold-soft)] px-3 py-2 text-xs text-[color:var(--warning)]">
      Atenção: este resultado possui uma base reduzida e deve ser interpretado com cautela.
    </p>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/40 bg-[color:var(--gold-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--warning)]">
      Dados de demonstração
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function MultipleChoiceNotice() {
  return (
    <p className="mt-3 text-xs text-muted-foreground">
      Pergunta de múltipla resposta. A soma dos percentuais pode ultrapassar 100%.
    </p>
  );
}