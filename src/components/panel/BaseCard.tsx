import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useAnalysis } from "@/lib/analysis";
import { municipalityByIbge, waveLabel } from "@/lib/data/mock";

export function BaseCard() {
  const [open, setOpen] = useState(false);
  const { base, activeSurveys } = useAnalysis();

  const rows: [string, string][] = [
    ["Pesquisas incluídas", String(base.surveys)],
    ["Municípios", String(base.municipalities)],
    ["Período", base.period],
    ["Entrevistas", base.interviews.toLocaleString("pt-BR")],
    ["Universo", base.universe.toLocaleString("pt-BR")],
    ["Margem de erro", `± ${base.marginOfError} p.p.`],
    ["Nível de confiança", `${base.confidence}%`],
    ["Ponderação", base.weighting],
  ];

  return (
    <>
      <div className="rounded-lg border border-[color:var(--sidebar-border)]/60 bg-white/[0.04] p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
          Base utilizada neste resultado
        </p>
        <dl className="mt-2 space-y-1">
          {rows.slice(0, 5).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-2 text-[11px]">
              <dt className="text-white/55">{k}</dt>
              <dd className="truncate tabular-nums text-white/90">{v}</dd>
            </div>
          ))}
        </dl>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setOpen(true)}
          className="mt-2 h-7 w-full justify-center border border-primary/40 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Ver detalhes da base
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Base utilizada neste resultado</DialogTitle>
            <DialogDescription>
              Nenhuma pesquisa é combinada sem escolha explícita. Confira abaixo as bases e as
              regras aplicadas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="rounded-md border border-border bg-secondary/60 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</p>
                <p className="text-sm font-medium tabular-nums text-foreground">{v}</p>
              </div>
            ))}
          </div>
          <div className="max-h-64 overflow-y-auto rounded-md border border-border">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-secondary text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Código</th>
                  <th className="px-3 py-2 font-medium">Município</th>
                  <th className="px-3 py-2 font-medium">Onda</th>
                  <th className="px-3 py-2 font-medium">Entrevistas</th>
                  <th className="px-3 py-2 font-medium">Questionário</th>
                  <th className="px-3 py-2 font-medium">Cenário</th>
                </tr>
              </thead>
              <tbody>
                {activeSurveys.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-[11px]">{s.code}</td>
                    <td className="px-3 py-2">{municipalityByIbge(s.municipalityIbge)?.name}</td>
                    <td className="px-3 py-2">{waveLabel(s)}</td>
                    <td className="px-3 py-2 tabular-nums">{s.interviews}</td>
                    <td className="px-3 py-2">{s.questionnaireCode} v{s.questionnaireVersion}</td>
                    <td className="px-3 py-2">{s.scenarioKey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}