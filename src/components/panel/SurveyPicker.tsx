import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/lib/analysis";
import { SURVEYS, municipalityByIbge, waveLabel } from "@/lib/data/mock";

export function SurveyPicker() {
  const [q, setQ] = useState("");
  const { selectedSurveyIds, toggleSurvey, setSelectedSurveyIds } = useAnalysis();
  const list = SURVEYS.filter((s) => s.status === "publicada").filter((s) =>
    (s.name + s.code).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por município, código ou onda"
          className="h-9"
        />
        <Button variant="outline" size="sm" onClick={() => setSelectedSurveyIds(list.map((s) => s.id))}>
          Todas
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setSelectedSurveyIds([])}>
          Limpar
        </Button>
      </div>
      <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
        {list.map((s) => (
          <li key={s.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2 transition-colors hover:bg-secondary">
              <Checkbox
                checked={selectedSurveyIds.includes(s.id)}
                onCheckedChange={() => toggleSurvey(s.id)}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-foreground">
                  {municipalityByIbge(s.municipalityIbge)?.name} — {waveLabel(s)}
                </span>
                <span className="block font-mono text-[11px] text-muted-foreground">
                  {s.code} · {s.interviews} entrevistas · {s.scenarioKey}
                </span>
              </span>
            </label>
          </li>
        ))}
        {!list.length && (
          <li className="px-3 py-6 text-center text-xs text-muted-foreground">
            Nenhuma pesquisa corresponde aos filtros selecionados.
          </li>
        )}
      </ul>
    </div>
  );
}