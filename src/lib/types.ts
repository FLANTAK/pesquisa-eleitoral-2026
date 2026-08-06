// Entidades de domínio do Painel de Inteligência Eleitoral — Ethos Institucional.
// Estas tipagens espelham as tabelas previstas em docs/DATABASE.md e permitem
// trocar a camada de dados (mock -> PostgreSQL/Supabase) sem alterar a UI.

export type Role = "admin" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  clientId?: string;
  organization: string;
  canExport: boolean;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  surveys: string[];
  canExport: boolean;
  status: "ativo" | "suspenso";
}

export interface Municipality {
  ibge: string;
  name: string;
  region: string;
  electorate: number;
}

export type SurveyStatus =
  | "rascunho"
  | "aguardando"
  | "validada"
  | "publicada"
  | "arquivada"
  | "erro";

export type SurveyOrigin = "csv" | "kobo" | "manual";

export interface Survey {
  id: string;
  code: string;
  name: string;
  municipalityIbge: string;
  state: "RO";
  startDate: string;
  endDate: string;
  wave: number;
  interviews: number;
  questionnaireCode: string;
  questionnaireVersion: string;
  origin: SurveyOrigin;
  status: SurveyStatus;
  importedAt: string;
  owner: string;
  updatedAt: string;
  marginOfError: number;
  confidence: number;
  universe: number;
  clientId: string;
  scenarioKey: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  ballotName: string;
  party: string;
  office: Office;
  color: string;
  status: "ativo" | "inativo";
  since: string;
  notes?: string;
}

export type Office =
  | "presidente"
  | "governador"
  | "senador"
  | "deputado_federal"
  | "deputado_estadual"
  | "prefeito";

export type AnalysisMode =
  | "individual"
  | "comparar"
  | "consolidar"
  | "ultima_por_cidade"
  | "todas";

export type WeightingMethod = "csv" | "calculado" | "manual";

export interface WeightingModel {
  id: string;
  name: string;
  method: WeightingMethod;
  description: string;
  isDefault?: boolean;
}

export type QuestionType =
  | "escolha_unica"
  | "multipla_escolha"
  | "aberta"
  | "numero"
  | "escala"
  | "avaliacao"
  | "ranking"
  | "data"
  | "localizacao"
  | "voto_espontaneo"
  | "voto_estimulado"
  | "rejeicao"
  | "potencial"
  | "aprovacao"
  | "confronto";

export interface Question {
  code: string;
  text: string;
  shortText: string;
  category: string;
  type: QuestionType;
  order: number;
  options: string[];
  multiple: boolean;
  required: boolean;
  scope: string;
  version: string;
}

export interface Questionnaire {
  code: string;
  name: string;
  version: string;
  createdAt: string;
  validFrom: string;
  clientId: string;
  description: string;
  status: "ativo" | "descontinuado" | "rascunho";
  file: string;
  owner: string;
  questions: Question[];
}

export type AlertSeverity = "critico" | "alto" | "medio" | "informativo";

export interface QualityAlert {
  id: string;
  severity: AlertSeverity;
  surveyCode: string;
  type: string;
  description: string;
  detectedAt: string;
  status: "aberto" | "ignorado" | "resolvido";
}

export interface KoboIntegration {
  id: string;
  name: string;
  serverUrl: string;
  tokenMask: string;
  projectId: string;
  formId: string;
  clientId: string;
  frequency: string;
  lastSync: string;
  status: "conectado" | "erro" | "nao_configurado";
}

export interface SyncLog {
  id: string;
  integrationId: string;
  date: string;
  newRecords: number;
  duplicates: number;
  status: "sucesso" | "falha" | "parcial";
  message: string;
}

export interface SharedLink {
  id: string;
  label: string;
  clientId: string;
  expiresAt: string;
  hasPassword: boolean;
  blockDownload: boolean;
  pages: string[];
  status: "ativo" | "revogado" | "expirado";
}

export interface AuditLog {
  id: string;
  date: string;
  user: string;
  action: string;
  target: string;
}

export interface Distribution {
  label: string;
  value: number;
  abs: number;
}