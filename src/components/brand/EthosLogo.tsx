export function EthosLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="9" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
        <path d="M13 12h14M13 20h11M13 28h14" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display text-lg tracking-wide text-primary">ETHOS</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
            Institucional
          </p>
        </div>
      )}
    </div>
  );
}

export function EthosLogoLight() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="9" fill="var(--ink)" />
        <path d="M13 12h14M13 20h11M13 28h14" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="leading-tight">
        <p className="font-display text-xl tracking-wide text-foreground">ETHOS</p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Institucional — Pesquisa e Comunicação
        </p>
      </div>
    </div>
  );
}