// Cliente HTTP do KoboToolbox (executa somente no servidor).

export interface KoboAsset {
  uid: string;
  name: string;
  owner: string;
  submissionCount: number;
  lastSubmission: string | null;
  status: string;
  active: boolean;
  questionCount: number;
  dateModified: string;
}

export interface KoboSyncResult {
  uid: string;
  name: string;
  total: number;
  fetched: number;
  newRecords: number;
  duplicates: number;
  lastSubmission: string | null;
  byDay: { date: string; count: number }[];
  fields: { code: string; label: string; answered: number }[];
  durationMs: number;
}

function config() {
  const token = process.env["KOBO_API_TOKEN"];
  const baseUrl = process.env["KOBO_BASE_URL"] ?? "https://kf.kobotoolbox.org";
  if (!token) throw new Error("KOBO_API_TOKEN não configurado no ambiente do servidor.");
  return { token, baseUrl: baseUrl.replace(/\/$/, "") };
}

async function koboFetch<T>(path: string): Promise<T> {
  const { token, baseUrl } = config();
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Token ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`KoboToolbox respondeu ${res.status}: ${body.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

type RawAsset = {
  uid: string;
  name: string;
  owner__username?: string;
  deployment__submission_count?: number;
  deployment__last_submission_time?: string | null;
  deployment_status?: string;
  deployment__active?: boolean;
  date_modified?: string;
  summary?: { row_count?: number };
};

export async function fetchAssets(): Promise<KoboAsset[]> {
  const data = await koboFetch<{ results: RawAsset[] }>(
    "/api/v2/assets/?format=json&limit=100",
  );
  return data.results
    .filter((a) => a.uid)
    .map((a) => ({
      uid: a.uid,
      name: a.name || a.uid,
      owner: a.owner__username ?? "—",
      submissionCount: a.deployment__submission_count ?? 0,
      lastSubmission: a.deployment__last_submission_time ?? null,
      status: a.deployment_status ?? "draft",
      active: Boolean(a.deployment__active),
      questionCount: a.summary?.row_count ?? 0,
      dateModified: a.date_modified ?? "",
    }));
}

type RawSubmission = Record<string, unknown> & {
  _id?: number;
  _uuid?: string;
  _submission_time?: string;
};

const META_PREFIXES = ["_", "formhub/", "meta/", "__"];

function isDataField(key: string) {
  return !META_PREFIXES.some((p) => key.startsWith(p));
}

export async function syncAsset(uid: string, knownUuids: string[]): Promise<KoboSyncResult> {
  const started = Date.now();
  const asset = await koboFetch<RawAsset>(`/api/v2/assets/${uid}/?format=json`);
  const page = await koboFetch<{ count: number; results: RawSubmission[] }>(
    `/api/v2/assets/${uid}/data/?format=json&limit=2000`,
  );
  const known = new Set(knownUuids);
  const seen = new Set<string>();
  const byDay = new Map<string, number>();
  const fieldCounts = new Map<string, number>();
  let newRecords = 0;
  let duplicates = 0;
  let lastSubmission: string | null = null;

  for (const row of page.results) {
    const id = row._uuid ?? String(row._id ?? "");
    if (!id || seen.has(id) || known.has(id)) duplicates += 1;
    else {
      newRecords += 1;
      seen.add(id);
    }
    const time = row._submission_time ?? null;
    if (time) {
      const day = time.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
      if (!lastSubmission || time > lastSubmission) lastSubmission = time;
    }
    for (const [key, value] of Object.entries(row)) {
      if (!isDataField(key)) continue;
      if (value === null || value === undefined || value === "") continue;
      fieldCounts.set(key, (fieldCounts.get(key) ?? 0) + 1);
    }
  }

  return {
    uid,
    name: asset.name || uid,
    total: page.count,
    fetched: page.results.length,
    newRecords,
    duplicates,
    lastSubmission,
    byDay: [...byDay.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count })),
    fields: [...fieldCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([code, answered]) => ({
        code,
        label: code.includes("/") ? code.split("/").slice(1).join("/") : code,
        answered,
      })),
    durationMs: Date.now() - started,
  };
}

export async function fetchSubmissionUuids(uid: string): Promise<string[]> {
  const page = await koboFetch<{ results: RawSubmission[] }>(
    `/api/v2/assets/${uid}/data/?format=json&limit=2000`,
  );
  return page.results.map((r) => r._uuid ?? String(r._id ?? "")).filter(Boolean);
}