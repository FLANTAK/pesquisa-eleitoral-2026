import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Download, Lock } from "lucide-react";
import { CONFIDENTIALITY_NOTE } from "@/lib/data/mock";
import { useAnalysis } from "@/lib/analysis";
import { useAuth } from "@/lib/auth";

const FORMATS = [
  { id: "pdf", label: "PDF completo", detail: "Capa institucional, metodologia, gráficos e tabelas." },
  { id: "pdf-page", label: "PDF da página atual", detail: "Somente as visualizações exibidas agora." },
  { id: "png", label: "PNG dos gráficos", detail: "Uma imagem por gráfico da página." },
  { id: "xlsx", label: "Excel com tabelas cruzadas", detail: "Percentuais, absolutos e bases." },
  { id: "csv", label: "CSV com dados filtrados", detail: "Registros agregados conforme os filtros." },
  { id: "pptx", label: "PowerPoint", detail: "Capa, metodologia, cenários, cruzamentos e conclusões descritivas." },
  { id: "link", label: "Link protegido para clientes", detail: "Senha, expiração e páginas liberadas." },
];

export function ExportDialog() {
  const [format, setFormat] = useState("pdf");
  const [note, setNote] = useState(CONFIDENTIALITY_NOTE);
  const [open, setOpen] = useState(false);
  const { base } = useAnalysis();
  const { can } = useAuth();

  if (!can("export")) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Exportar relatório</DialogTitle>
          <DialogDescription>
            {base.surveys} pesquisa(s) · {base.interviews.toLocaleString("pt-BR")} entrevistas ·{" "}
            {base.period} · ponderação: {base.weighting}.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={format} onValueChange={setFormat} className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {FORMATS.map((f) => (
            <label
              key={f.id}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-secondary"
            >
              <RadioGroupItem value={f.id} id={f.id} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium text-foreground">{f.label}</span>
                <span className="block text-xs text-muted-foreground">{f.detail}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
        <div className="space-y-2">
          <Label htmlFor="conf" className="text-xs uppercase tracking-wide text-muted-foreground">
            Rodapé de confidencialidade
          </Label>
          <Textarea id="conf" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("Exportação iniciada", {
                description: "O arquivo será disponibilizado em Relatórios e Exportações.",
              });
            }}
            className="gap-2"
          >
            <Lock className="h-4 w-4" /> Gerar arquivo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}