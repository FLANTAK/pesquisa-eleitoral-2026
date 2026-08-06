/**
 * DADOS DE DEMONSTRAÇÃO — Ethos Institucional.
 * Nenhum número aqui representa pesquisa real. A camada é isolada em
 * `src/lib/data` para ser substituída por repositórios PostgreSQL/Supabase.
 */
import type {
  AuditLog,
  Candidate,
  Client,
  Distribution,
  KoboIntegration,
  Municipality,
  QualityAlert,
  Questionnaire,
  SharedLink,
  Survey,
  SyncLog,
  WeightingModel,
} from "@/lib/types";

export const DEMO = true;

export const MUNICIPALITIES: Municipality[] = [
  { ibge: "1100205", name: "Porto Velho", region: "Madeira-Mamoré", electorate: 344800 },
  { ibge: "1100122", name: "Ji-Paraná", region: "Central", electorate: 91500 },
  { ibge: "1100023", name: "Ariquemes", region: "Vale do Jamari", electorate: 78200 },
  { ibge: "1100049", name: "Cacoal", region: "Café", electorate: 67400 },
  { ibge: "1100304", name: "Vilhena", region: "Cone Sul", electorate: 66100 },
  { ibge: "1100114", name: "Jaru", region: "Vale do Jamari", electorate: 42300 },
  { ibge: "1100254", name: "Rolim de Moura", region: "Zona da Mata", electorate: 40100 },
  { ibge: "1100189", name: "Ouro Preto do Oeste", region: "Central", electorate: 30900 },
];

export const municipalityByIbge = (ibge: string) =>
  MUNICIPALITIES.find((m) => m.ibge === ibge);

export const REGIONS = Array.from(new Set(MUNICIPALITIES.map((m) => m.region)));

export const CANDIDATES: Candidate[] = [
  { id: "c1", fullName: "Helena Vasconcelos Braga", ballotName: "Helena Braga", party: "PDT", office: "governador", color: "#C99A19", status: "ativo", since: "2025-11-01" },
  { id: "c2", fullName: "Ricardo Almeida Nogueira", ballotName: "Ricardo Nogueira", party: "PL", office: "governador", color: "#2B2B2B", status: "ativo", since: "2025-11-01" },
  { id: "c3", fullName: "Marcos Teodoro Lima", ballotName: "Marcos Teodoro", party: "MDB", office: "governador", color: "#3C7A57", status: "ativo", since: "2025-11-01" },
  { id: "c4", fullName: "Sandra Rocha Ferraz", ballotName: "Sandra Ferraz", party: "PT", office: "governador", color: "#C54444", status: "ativo", since: "2026-01-15" },
  { id: "c5", fullName: "Eduardo Pacheco Martins", ballotName: "Eduardo Pacheco", party: "UNIÃO", office: "governador", color: "#D8B64A", status: "ativo", since: "2025-11-01" },
  { id: "s1", fullName: "Antônio Carlos Meireles", ballotName: "Antônio Meireles", party: "PP", office: "senador", color: "#C99A19", status: "ativo", since: "2025-11-01" },
  { id: "s2", fullName: "Luciana Prado Dantas", ballotName: "Luciana Prado", party: "PSD", office: "senador", color: "#2B2B2B", status: "ativo", since: "2025-11-01" },
  { id: "s3", fullName: "Jorge Bandeira Souza", ballotName: "Jorge Bandeira", party: "REPUBLICANOS", office: "senador", color: "#3C7A57", status: "ativo", since: "2025-11-01" },
];

export const CLIENTS: Client[] = [
  { id: "cl1", name: "Comitê Institucional A", contact: "contato@institucional-a.com.br", surveys: [], canExport: true, status: "ativo" },
  { id: "cl2", name: "Federação Municipalista RO", contact: "gabinete@fmro.org.br", surveys: [], canExport: false, status: "ativo" },
  { id: "cl3", name: "Ethos — Base Interna", contact: "dados@ethosinstitucional.com.br", surveys: [], canExport: true, status: "ativo" },
];

const WAVES = [
  { wave: 1, start: "2026-05-04", end: "2026-05-11", label: "Maio/2026" },
  { wave: 2, start: "2026-06-08", end: "2026-06-15", label: "Junho/2026" },
  { wave: 3, start: "2026-08-03", end: "2026-08-10", label: "Agosto/2026" },
];

export const WAVE_LABELS = WAVES.map((w) => w.label);

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const abbrev: Record<string, string> = {
  "1100205": "PVH", "1100122": "JIP", "1100023": "ARQ", "1100049": "CAC",
  "1100304": "VLH", "1100114": "JAR", "1100254": "RDM", "1100189": "OPO",
};

export const SURVEYS: Survey[] = MUNICIPALITIES.flatMap((m, mi) =>
  WAVES.map((w) => {
    const rnd = seeded(m.ibge + w.wave);
    const interviews = Math.round(380 + rnd() * 420);
    const month = w.start.slice(5, 7);
    return {
      id: `RO_${abbrev[m.ibge]}_2026_${month}_0${w.wave}`,
      code: `RO_${abbrev[m.ibge]}_2026_${month}_0${w.wave}`,
      name: `${m.name} — Onda ${w.wave} (${w.label})`,
      municipalityIbge: m.ibge,
      state: "RO" as const,
      startDate: w.start,
      endDate: w.end,
      wave: w.wave,
      interviews,
      questionnaireCode: "QB-RO-2026",
      questionnaireVersion: w.wave === 3 ? "1.2" : "1.1",
      origin: (w.wave === 3 ? "kobo" : "csv") as Survey["origin"],
      status: (w.wave === 3 && mi > 5 ? "aguardando" : "publicada") as Survey["status"],
      importedAt: `${w.end}T18:32:00Z`,
      owner: mi % 2 === 0 ? "Camila Duarte" : "Rafael Sanches",
      updatedAt: `${w.end}T20:05:00Z`,
      marginOfError: interviews > 700 ? 3.5 : 4.4,
      confidence: 95,
      universe: m.electorate,
      clientId: mi % 3 === 0 ? "cl1" : mi % 3 === 1 ? "cl2" : "cl3",
      scenarioKey: w.wave === 3 ? "Cenário B (com Sandra Ferraz)" : "Cenário A",
    };
  }),
);

export const surveyById = (id: string) => SURVEYS.find((s) => s.id === id);

export function waveLabel(s: Survey) {
  return WAVES.find((w) => w.wave === s.wave)?.label ?? `Onda ${s.wave}`;
}

/* ---------------- distribuições ---------------- */

function normalize(entries: [string, number][], base: number): Distribution[] {
  const sum = entries.reduce((a, [, v]) => a + v, 0) || 1;
  return entries.map(([label, v]) => {
    const value = (v / sum) * 100;
    return { label, value: Math.round(value * 10) / 10, abs: Math.round((value / 100) * base) };
  });
}

function weightedMerge(parts: { dist: Distribution[]; weight: number }[]): Distribution[] {
  const acc = new Map<string, number>();
  const base = parts.reduce((a, p) => a + p.weight, 0);
  for (const p of parts) {
    for (const d of p.dist) acc.set(d.label, (acc.get(d.label) ?? 0) + d.value * p.weight);
  }
  return normalize([...acc.entries()].map(([k, v]) => [k, v]), base);
}

export function surveyWeight(s: Survey, method: string) {
  if (method === "manual") return 1;
  if (method === "calculado") return s.universe;
  return s.interviews;
}

const VOTE_BASE: Record<string, number> = { c1: 24, c2: 21, c3: 14, c4: 9, c5: 7 };

export function voteIntention(survey: Survey, office = "governador"): Distribution[] {
  const rnd = seeded(survey.id + office);
  const cands = CANDIDATES.filter((c) => c.office === office);
  const entries: [string, number][] = cands.map((c) => {
    const base = VOTE_BASE[c.id] ?? 12;
    const drift = (survey.wave - 1) * (c.id === "c1" ? 2.4 : c.id === "c2" ? 1.2 : -0.6);
    return [c.ballotName, Math.max(1, base + drift + (rnd() - 0.5) * 7)];
  });
  entries.push(["Branco/Nulo", 8 + rnd() * 3 - survey.wave]);
  entries.push(["Indeciso", 17 + rnd() * 4 - survey.wave * 2]);
  return normalize(entries, survey.interviews);
}

export function aggregateVote(surveys: Survey[], method: string, office = "governador") {
  if (!surveys.length) return [];
  return weightedMerge(
    surveys.map((s) => ({ dist: voteIntention(s, office), weight: surveyWeight(s, method) })),
  );
}

export const PROFILE_VARIABLES = {
  sexo: ["Masculino", "Feminino"],
  idade: ["16 a 24", "25 a 34", "35 a 44", "45 a 59", "60 ou mais"],
  renda: ["Até 1 salário", "1 a 2 salários", "2 a 5 salários", "Mais de 5 salários"],
  escolaridade: ["Fundamental", "Médio", "Superior", "Pós-graduação"],
  religiao: ["Católica", "Evangélica", "Espírita", "Outra", "Sem religião"],
  zona: ["Urbana", "Rural"],
  posicionamento: ["Direita", "Centro", "Esquerda", "Não sabe"],
  regiao: REGIONS,
  municipio: MUNICIPALITIES.map((m) => m.name),
  periodo: WAVE_LABELS,
} as const;

export type ProfileVariable = keyof typeof PROFILE_VARIABLES;

export const VARIABLE_LABELS: Record<ProfileVariable, string> = {
  sexo: "Sexo",
  idade: "Idade",
  renda: "Renda familiar",
  escolaridade: "Escolaridade",
  religiao: "Religião",
  zona: "Zona urbana ou rural",
  posicionamento: "Posicionamento político",
  regiao: "Região",
  municipio: "Município",
  periodo: "Período",
};

export function profileDistribution(surveys: Survey[], variable: ProfileVariable): Distribution[] {
  const labels = PROFILE_VARIABLES[variable] as readonly string[];
  const base = surveys.reduce((a, s) => a + s.interviews, 0);
  const rnd = seeded(variable + surveys.map((s) => s.id).join("|"));
  return normalize(labels.map((l) => [l, 0.4 + rnd()]), base);
}

export const EVALUATION_LABELS = [
  "Ótimo", "Bom", "Regular positivo", "Regular negativo", "Ruim", "Péssimo", "NS/NR",
];

export function governmentEvaluation(surveys: Survey[], target = "governador"): Distribution[] {
  const base = surveys.reduce((a, s) => a + s.interviews, 0) || 1;
  const rnd = seeded(target + surveys.map((s) => s.id).join("|"));
  const weights = [9, 24, 18, 14, 12, 9, 4].map((w) => w * (0.8 + rnd() * 0.4));
  return normalize(EVALUATION_LABELS.map((l, i) => [l, weights[i]!]), base);
}

export function approval(surveys: Survey[], target = "governador") {
  const d = governmentEvaluation(surveys, target);
  const get = (l: string) => d.find((x) => x.label === l)?.value ?? 0;
  const aprova = get("Ótimo") + get("Bom") + get("Regular positivo");
  const desaprova = get("Regular negativo") + get("Ruim") + get("Péssimo");
  return {
    aprova: Math.round(aprova * 10) / 10,
    desaprova: Math.round(desaprova * 10) / 10,
    nsnr: Math.round(get("NS/NR") * 10) / 10,
  };
}

export const PRIORITIES = [
  "Saúde pública", "Segurança", "Geração de emprego", "Educação", "Infraestrutura e estradas",
  "Custo de vida", "Agricultura e produção rural", "Combate à corrupção",
];

export function priorityRanking(surveys: Survey[]): Distribution[] {
  const base = surveys.reduce((a, s) => a + s.interviews, 0) || 1;
  const rnd = seeded("prio" + surveys.map((s) => s.id).join("|"));
  return PRIORITIES.map((p, i) => {
    const v = Math.max(4, 48 - i * 4.5 + (rnd() - 0.5) * 10);
    return { label: p, value: Math.round(v * 10) / 10, abs: Math.round((v / 100) * base) };
  }).sort((a, b) => b.value - a.value);
}

/** Tabela cruzada: pergunta principal x variável de cruzamento. */
export function crosstab(
  surveys: Survey[],
  rows: string[],
  variable: ProfileVariable,
  method: string,
) {
  const columns = PROFILE_VARIABLES[variable] as readonly string[];
  const totalBase = surveys.reduce((a, s) => a + s.interviews, 0);
  const colBases = columns.map((c, i) => {
    const rnd = seeded(c + variable + i + surveys.length);
    return Math.max(12, Math.round((totalBase / columns.length) * (0.55 + rnd())));
  });
  const overall = surveys.length
    ? weightedMerge(surveys.map((s) => ({ dist: voteIntention(s), weight: surveyWeight(s, method) })))
    : [];
  const cells = rows.map((r) => {
    const total = overall.find((o) => o.label === r)?.value ?? 10;
    return columns.map((c) => {
      const rnd = seeded(r + c + variable);
      return Math.round(Math.max(0.5, total * (0.65 + rnd() * 0.75)) * 10) / 10;
    });
  });
  return { columns: [...columns], colBases, cells, rows, totals: overall };
}

/** Série temporal por candidato usando as ondas disponíveis. */
export function evolutionSeries(surveys: Survey[], office = "governador") {
  const byWave = WAVES.map((w) => {
    const subset = surveys.filter((s) => s.wave === w.wave);
    const dist = subset.length ? aggregateVote(subset, "csv", office) : [];
    const point: Record<string, string | number> = {
      periodo: w.label,
      entrevistas: subset.reduce((a, s) => a + s.interviews, 0),
      cenario: subset[0]?.scenarioKey ?? "—",
    };
    for (const d of dist) point[d.label] = d.value;
    return point;
  }).filter((p) => (p["entrevistas"] as number) > 0);
  return byWave;
}

export const WEIGHTING_MODELS: WeightingModel[] = [
  { id: "w1", name: "Fechamento estadual padrão", method: "calculado", description: "Peso geográfico pelo universo eleitoral de cada município.", isDefault: true },
  { id: "w2", name: "Interior de Rondônia", method: "calculado", description: "Exclui a capital e reequilibra as regiões do interior." },
  { id: "w3", name: "Peso do arquivo (CSV)", method: "csv", description: "Utiliza a coluna de peso já presente na base importada." },
  { id: "w4", name: "Pesquisa sem ponderação", method: "manual", description: "Todos os registros com peso 1." },
];

export const QUESTIONNAIRES: Questionnaire[] = [
  {
    code: "QB-RO-2026",
    name: "Questionário Base Rondônia 2026",
    version: "1.2",
    createdAt: "2026-03-12",
    validFrom: "2026-05-01",
    clientId: "cl3",
    description: "Instrumento padrão para ondas estaduais e municipais em Rondônia.",
    status: "ativo",
    file: "questionario-base-ro-2026-v12.pdf",
    owner: "Camila Duarte",
    questions: [
      { code: "P01", text: "Sexo do entrevistado", shortText: "Sexo", category: "Perfil", type: "escolha_unica", order: 1, options: ["Masculino", "Feminino"], multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P02", text: "Qual a sua faixa etária?", shortText: "Idade", category: "Perfil", type: "escolha_unica", order: 2, options: [...PROFILE_VARIABLES.idade], multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P03", text: "Qual a renda familiar mensal?", shortText: "Renda", category: "Perfil", type: "escolha_unica", order: 3, options: [...PROFILE_VARIABLES.renda], multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P04", text: "Até que série o(a) sr(a). estudou?", shortText: "Escolaridade", category: "Perfil", type: "escolha_unica", order: 4, options: [...PROFILE_VARIABLES.escolaridade], multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P05", text: "Qual a sua religião?", shortText: "Religião", category: "Perfil", type: "escolha_unica", order: 5, options: [...PROFILE_VARIABLES.religiao], multiple: false, required: false, scope: "Estadual", version: "1.2" },
      { code: "P06", text: "A residência fica em zona urbana ou rural?", shortText: "Zona", category: "Perfil", type: "escolha_unica", order: 6, options: ["Urbana", "Rural"], multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P10", text: "Se a eleição para governador fosse hoje, em quem votaria? (espontânea)", shortText: "Governador espontânea", category: "Cenários", type: "voto_espontaneo", order: 10, options: [], multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P11", text: "E entre os nomes a seguir, em quem votaria para governador?", shortText: "Governador estimulada", category: "Cenários", type: "voto_estimulado", order: 11, options: CANDIDATES.filter((c) => c.office === "governador").map((c) => c.ballotName), multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P12", text: "Em quem o(a) sr(a). não votaria de jeito nenhum?", shortText: "Rejeição", category: "Cenários", type: "rejeicao", order: 12, options: CANDIDATES.filter((c) => c.office === "governador").map((c) => c.ballotName), multiple: true, required: false, scope: "Estadual", version: "1.2" },
      { code: "P20", text: "Como o(a) sr(a). avalia o governo do estado?", shortText: "Avaliação governador", category: "Avaliação", type: "avaliacao", order: 20, options: EVALUATION_LABELS, multiple: false, required: true, scope: "Estadual", version: "1.2" },
      { code: "P30", text: "Quais devem ser as prioridades do próximo governo?", shortText: "Prioridades", category: "Pautas", type: "multipla_escolha", order: 30, options: PRIORITIES, multiple: true, required: false, scope: "Estadual", version: "1.2" },
    ],
  },
  {
    code: "QM-MUN-2026",
    name: "Complemento Municipal 2026",
    version: "1.0",
    createdAt: "2026-04-02",
    validFrom: "2026-05-01",
    clientId: "cl2",
    description: "Blocos adicionais aplicados apenas em pesquisas municipais.",
    status: "ativo",
    file: "complemento-municipal-2026.docx",
    owner: "Rafael Sanches",
    questions: [
      { code: "M01", text: "Como avalia a prefeitura do seu município?", shortText: "Avaliação prefeitura", category: "Avaliação", type: "avaliacao", order: 1, options: EVALUATION_LABELS, multiple: false, required: true, scope: "Municipal", version: "1.0" },
      { code: "M02", text: "Qual o principal problema do seu bairro?", shortText: "Problema local", category: "Pautas", type: "escolha_unica", order: 2, options: PRIORITIES, multiple: false, required: false, scope: "Municipal", version: "1.0" },
    ],
  },
];

export const QUALITY_ALERTS: QualityAlert[] = [
  { id: "q1", severity: "critico", surveyCode: "RO_JAR_2026_08_03", type: "Entrevistas duplicadas", description: "12 registros com o mesmo ID de submissão do KoboToolbox.", detectedAt: "2026-08-10", status: "aberto" },
  { id: "q2", severity: "alto", surveyCode: "RO_RDM_2026_08_03", type: "Perguntas não mapeadas", description: "3 colunas do arquivo não foram associadas ao questionário.", detectedAt: "2026-08-10", status: "aberto" },
  { id: "q3", severity: "alto", surveyCode: "RO_OPO_2026_08_03", type: "Coordenadas fora de Rondônia", description: "5 entrevistas com latitude/longitude fora dos limites do estado.", detectedAt: "2026-08-11", status: "aberto" },
  { id: "q4", severity: "medio", surveyCode: "RO_CAC_2026_06_02", type: "Pesquisa sem peso", description: "Nenhuma coluna de peso encontrada; será usada ponderação calculada.", detectedAt: "2026-06-16", status: "ignorado" },
  { id: "q5", severity: "medio", surveyCode: "RO_VLH_2026_06_02", type: "Divergência de amostra", description: "Amostra declarada 600, registros importados 587.", detectedAt: "2026-06-16", status: "aberto" },
  { id: "q6", severity: "informativo", surveyCode: "RO_PVH_2026_08_03", type: "Diferença entre questionários", description: "Cenário B inclui nova candidata; comparação exige atenção.", detectedAt: "2026-08-11", status: "resolvido" },
];

export const KOBO_INTEGRATIONS: KoboIntegration[] = [
  { id: "k1", name: "Kobo — Campo Rondônia 2026", serverUrl: "https://kf.kobotoolbox.org", tokenMask: "••••••••••••4f2a", projectId: "aXbY7", formId: "aM4kQz2R", clientId: "cl3", frequency: "Manual", lastSync: "2026-08-11T09:40:00Z", status: "conectado" },
  { id: "k2", name: "Kobo — Municipais interior", serverUrl: "https://kf.kobotoolbox.org", tokenMask: "••••••••••••91c7", projectId: "bZk22", formId: "bT9uPw1L", clientId: "cl2", frequency: "Diária (preparado)", lastSync: "2026-08-09T21:10:00Z", status: "erro" },
];

export const SYNC_LOGS: SyncLog[] = [
  { id: "s1", integrationId: "k1", date: "2026-08-11T09:40:00Z", newRecords: 128, duplicates: 4, status: "sucesso", message: "Sincronização concluída. Novas entrevistas foram adicionadas à pesquisa." },
  { id: "s2", integrationId: "k1", date: "2026-08-05T14:02:00Z", newRecords: 96, duplicates: 0, status: "sucesso", message: "Importação incremental." },
  { id: "s3", integrationId: "k2", date: "2026-08-09T21:10:00Z", newRecords: 0, duplicates: 0, status: "falha", message: "Token inválido ou expirado." },
];

export const SHARED_LINKS: SharedLink[] = [
  { id: "l1", label: "Fechamento estadual — Comitê A", clientId: "cl1", expiresAt: "2026-09-30", hasPassword: true, blockDownload: false, pages: ["Visão Geral", "Mapa", "Evolução"], status: "ativo" },
  { id: "l2", label: "Interior — Federação Municipalista", clientId: "cl2", expiresAt: "2026-08-20", hasPassword: true, blockDownload: true, pages: ["Visão Geral"], status: "ativo" },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: "a1", date: "2026-08-11T10:12:00Z", user: "Camila Duarte", action: "Publicou pesquisa", target: "RO_PVH_2026_08_03" },
  { id: "a2", date: "2026-08-11T09:41:00Z", user: "Sistema", action: "Sincronização KoboToolbox", target: "Kobo — Campo Rondônia 2026" },
  { id: "a3", date: "2026-08-10T17:22:00Z", user: "Rafael Sanches", action: "Alterou modelo de ponderação", target: "Fechamento estadual padrão" },
  { id: "a4", date: "2026-08-10T16:03:00Z", user: "Camila Duarte", action: "Liberou pesquisa para cliente", target: "Comitê Institucional A" },
];

export const CONFIDENTIALITY_NOTE =
  "Pesquisa realizada para consumo interno. Proibida a divulgação e/ou compartilhamento sem autorização da Ethos Institucional.";