import { useEffect, useMemo, useState } from "react";
import { useAnalysis } from "@/lib/analysis";
import { MUNICIPALITIES, SURVEYS, municipalityByIbge } from "@/lib/data/mock";
import { Skeleton } from "@/components/ui/skeleton";

interface Feature {
  type: "Feature";
  properties: { id: string; nome: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
}

function ringsOf(f: Feature): number[][][] {
  return f.geometry.type === "Polygon"
    ? (f.geometry.coordinates as number[][][])
    : (f.geometry.coordinates as number[][][][]).flat();
}

export function RondoniaMap({ search = "" }: { search?: string }) {
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [hover, setHover] = useState<{ name: string; ibge: string; x: number; y: number } | null>(null);
  const { selectedMunicipalities, toggleMunicipality } = useAnalysis();

  useEffect(() => {
    let alive = true;
    fetch("/geo/rondonia.json")
      .then((r) => r.json())
      .then((g: { features: Feature[] }) => alive && setFeatures(g.features))
      .catch(() => alive && setFeatures([]));
    return () => {
      alive = false;
    };
  }, []);

  const view = useMemo(() => {
    if (!features?.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const f of features)
      for (const ring of ringsOf(f))
        for (const [x, y] of ring) {
          if (x! < minX) minX = x!;
          if (x! > maxX) maxX = x!;
          if (y! < minY) minY = y!;
          if (y! > maxY) maxY = y!;
        }
    const w = maxX - minX;
    const h = maxY - minY;
    const paths = features.map((f) => ({
      ibge: f.properties.id,
      name: f.properties.nome,
      d: ringsOf(f)
        .map((ring) => ring.map(([x, y], i) => `${i ? "L" : "M"}${x} ${-y!}`).join(" ") + " Z")
        .join(" "),
    }));
    return { paths, viewBox: `${minX} ${-maxY} ${w} ${h}` };
  }, [features]);

  if (!features) return <Skeleton className="h-[420px] w-full rounded-lg" />;
  if (!view)
    return (
      <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
        Não foi possível carregar os limites municipais.
      </div>
    );

  const interviewsOf = (ibge: string) =>
    SURVEYS.filter((s) => s.municipalityIbge === ibge).reduce((a, s) => a + s.interviews, 0);
  const hasData = (ibge: string) => MUNICIPALITIES.some((m) => m.ibge === ibge);
  const matches = (name: string) =>
    search.length > 1 && name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="relative">
      <svg viewBox={view.viewBox} className="h-[420px] w-full" role="img" aria-label="Mapa municipal de Rondônia">
        {view.paths.map((p) => {
          const selected = selectedMunicipalities.includes(p.ibge);
          const data = hasData(p.ibge);
          const fill = selected
            ? "var(--ink)"
            : matches(p.name)
              ? "var(--gold)"
              : data
                ? "var(--gold-soft)"
                : "var(--secondary)";
          return (
            <path
              key={p.ibge}
              d={p.d}
              fill={fill}
              stroke="#fff"
              strokeWidth={0.012}
              className="cursor-pointer transition-[fill] duration-200"
              onClick={() => toggleMunicipality(p.ibge)}
              onMouseMove={(e) => {
                const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                setHover({ name: p.name, ibge: p.ibge, x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute z-10 w-56 rounded-md border border-border bg-card p-3 text-xs shadow-lg"
          style={{ left: Math.min(hover.x + 12, 520), top: hover.y + 12 }}
        >
          <p className="text-sm font-semibold text-foreground">{hover.name}</p>
          {(() => {
            const m = municipalityByIbge(hover.ibge);
            const surveys = SURVEYS.filter((s) => s.municipalityIbge === hover.ibge);
            if (!m)
              return (
                <p className="mt-1 text-muted-foreground">
                  Ainda não existem entrevistas disponíveis para este município no período
                  selecionado.
                </p>
              );
            return (
              <dl className="mt-1 space-y-0.5 text-muted-foreground">
                <div className="flex justify-between"><dt>Região</dt><dd className="text-foreground">{m.region}</dd></div>
                <div className="flex justify-between"><dt>Eleitorado</dt><dd className="tabular-nums text-foreground">{m.electorate.toLocaleString("pt-BR")}</dd></div>
                <div className="flex justify-between"><dt>Pesquisas</dt><dd className="tabular-nums text-foreground">{surveys.length}</dd></div>
                <div className="flex justify-between"><dt>Última pesquisa</dt><dd className="text-foreground">{surveys.at(-1)?.endDate ?? "—"}</dd></div>
                <div className="flex justify-between"><dt>Entrevistas</dt><dd className="tabular-nums text-foreground">{interviewsOf(hover.ibge)}</dd></div>
              </dl>
            );
          })()}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
        <Legend color="var(--gold-soft)" label="Com dados" />
        <Legend color="var(--secondary)" label="Sem dados" />
        <Legend color="var(--ink)" label="Selecionado" />
        <Legend color="var(--gold)" label="Resultado da busca" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-sm border border-border" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}