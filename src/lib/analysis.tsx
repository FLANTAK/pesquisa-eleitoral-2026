import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  MUNICIPALITIES,
  SURVEYS,
  WEIGHTING_MODELS,
  surveyWeight,
} from "@/lib/data/mock";
import type { AnalysisMode, Survey } from "@/lib/types";

/**
 * Estado global de análise: modo de consolidação, pesquisas escolhidas,
 * municípios selecionados no mapa e regra de ponderação ativa.
 * Os filtros são preservados durante toda a navegação.
 */
interface AnalysisValue {
  mode: AnalysisMode;
  setMode: (m: AnalysisMode) => void;
  selectedSurveyIds: string[];
  toggleSurvey: (id: string) => void;
  setSelectedSurveyIds: (ids: string[]) => void;
  selectedMunicipalities: string[];
  toggleMunicipality: (ibge: string) => void;
  setSelectedMunicipalities: (ids: string[]) => void;
  weightingId: string;
  setWeightingId: (id: string) => void;
  office: string;
  setOffice: (o: string) => void;
  reset: () => void;
  /** Pesquisas efetivamente usadas nos cálculos, conforme o modo. */
  activeSurveys: Survey[];
  base: {
    interviews: number;
    municipalities: number;
    period: string;
    marginOfError: number;
    confidence: number;
    universe: number;
    surveys: number;
    questionnaires: string;
    weighting: string;
    method: string;
    updatedAt: string;
  };
}

const AnalysisContext = createContext<AnalysisValue | null>(null);

const PUBLISHED = SURVEYS.filter((s) => s.status === "publicada");
const DEFAULT_SURVEYS = PUBLISHED.filter((s) => s.wave === 2).map((s) => s.id);

function fmt(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AnalysisMode>("consolidar");
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>(DEFAULT_SURVEYS);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
  const [weightingId, setWeightingId] = useState(WEIGHTING_MODELS[0]!.id);
  const [office, setOffice] = useState("governador");

  const value = useMemo<AnalysisValue>(() => {
    const model = WEIGHTING_MODELS.find((w) => w.id === weightingId) ?? WEIGHTING_MODELS[0]!;
    const inArea = (s: Survey) =>
      selectedMunicipalities.length === 0 || selectedMunicipalities.includes(s.municipalityIbge);

    let active: Survey[] = [];
    const chosen = PUBLISHED.filter((s) => selectedSurveyIds.includes(s.id)).filter(inArea);
    if (mode === "individual") active = chosen.slice(0, 1);
    else if (mode === "todas") active = PUBLISHED.filter(inArea);
    else if (mode === "ultima_por_cidade") {
      const map = new Map<string, Survey>();
      for (const s of PUBLISHED.filter(inArea)) {
        const cur = map.get(s.municipalityIbge);
        if (!cur || s.endDate > cur.endDate) map.set(s.municipalityIbge, s);
      }
      active = [...map.values()];
    } else active = chosen;

    const interviews = active.reduce((a, s) => a + s.interviews, 0);
    const universe = [...new Set(active.map((s) => s.municipalityIbge))].reduce(
      (a, ibge) => a + (MUNICIPALITIES.find((m) => m.ibge === ibge)?.electorate ?? 0),
      0,
    );
    const dates = active.flatMap((s) => [s.startDate, s.endDate]).sort();
    const totalWeight = active.reduce((a, s) => a + surveyWeight(s, model.method), 0) || 1;
    const moe = active.length
      ? Math.round(
          (active.reduce((a, s) => a + s.marginOfError * surveyWeight(s, model.method), 0) /
            totalWeight) * 10,
        ) / 10
      : 0;

    return {
      mode, setMode,
      selectedSurveyIds,
      toggleSurvey: (id) =>
        setSelectedSurveyIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        ),
      setSelectedSurveyIds,
      selectedMunicipalities,
      toggleMunicipality: (ibge) =>
        setSelectedMunicipalities((prev) =>
          prev.includes(ibge) ? prev.filter((x) => x !== ibge) : [...prev, ibge],
        ),
      setSelectedMunicipalities,
      weightingId, setWeightingId,
      office, setOffice,
      reset: () => {
        setMode("consolidar");
        setSelectedSurveyIds(DEFAULT_SURVEYS);
        setSelectedMunicipalities([]);
        setWeightingId(WEIGHTING_MODELS[0]!.id);
        setOffice("governador");
      },
      activeSurveys: active,
      base: {
        interviews,
        municipalities: new Set(active.map((s) => s.municipalityIbge)).size,
        period: dates.length ? `${fmt(dates[0]!)} a ${fmt(dates[dates.length - 1]!)}` : "—",
        marginOfError: moe,
        confidence: 95,
        universe,
        surveys: active.length,
        questionnaires: [...new Set(active.map((s) => `${s.questionnaireCode} v${s.questionnaireVersion}`))].join(", ") || "—",
        weighting: model.name,
        method: model.method,
        updatedAt: "11/08/2026 09:40",
      },
    };
  }, [mode, selectedSurveyIds, selectedMunicipalities, weightingId, office]);

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis deve ser usado dentro de AnalysisProvider");
  return ctx;
}