import { useAnalysis } from "@/lib/analysis";
import { cn } from "@/lib/utils";
import type { AnalysisMode } from "@/lib/types";

const MODES: { id: AnalysisMode; label: string }[] = [
  { id: "individual", label: "Pesquisa individual" },
  { id: "comparar", label: "Comparar pesquisas" },
  { id: "consolidar", label: "Consolidar selecionadas" },
  { id: "ultima_por_cidade", label: "Última pesquisa de cada cidade" },
  { id: "todas", label: "Consolidar todas" },
];

export function ModeSelector() {
  const { mode, setMode } = useAnalysis();
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200",
            mode === m.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}