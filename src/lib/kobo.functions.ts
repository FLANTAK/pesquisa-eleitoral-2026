import { createServerFn } from "@tanstack/react-start";
import { fetchAssets, syncAsset } from "./kobo.server";

export const listKoboAssets = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return { ok: true as const, assets: await fetchAssets() };
  } catch (error) {
    return { ok: false as const, assets: [], error: (error as Error).message };
  }
});

export const syncKoboAsset = createServerFn({ method: "POST" })
  .inputValidator((input: { uid: string; knownUuids?: string[] }) => {
    if (!input?.uid || typeof input.uid !== "string" || input.uid.length > 64) {
      throw new Error("uid inválido");
    }
    return {
      uid: input.uid,
      knownUuids: Array.isArray(input.knownUuids) ? input.knownUuids.slice(0, 5000) : [],
    };
  })
  .handler(async ({ data }) => {
    try {
      return { ok: true as const, result: await syncAsset(data.uid, data.knownUuids) };
    } catch (error) {
      return { ok: false as const, result: null, error: (error as Error).message };
    }
  });