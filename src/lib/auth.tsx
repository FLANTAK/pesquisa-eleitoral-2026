import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role, User } from "@/lib/types";

/**
 * Camada de autenticação isolada. Hoje resolve contra usuários de demonstração
 * em memória; a troca por Supabase/PostgreSQL exige apenas reimplementar
 * `signIn` e `restore` mantendo o mesmo contrato.
 */
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: "u1", name: "Camila Duarte", email: "admin@ethos.com.br", role: "admin",
    organization: "Ethos Institucional", canExport: true, password: "ethos2026",
  },
  {
    id: "u2", name: "Comitê Institucional A", email: "cliente@ethos.com.br", role: "client",
    clientId: "cl1", organization: "Comitê Institucional A", canExport: true, password: "cliente2026",
  },
];

export const DEMO_CREDENTIALS = DEMO_USERS.map((u) => ({
  email: u.email, password: u.password, role: u.role,
}));

interface AuthValue {
  user: User | null;
  ready: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
  can: (permission: Permission) => boolean;
}

export type Permission =
  | "surveys.manage"
  | "import.csv"
  | "kobo.manage"
  | "questionnaires.manage"
  | "weighting.manage"
  | "clients.manage"
  | "quality.view"
  | "raw.view"
  | "export";

const ADMIN_ONLY: Permission[] = [
  "surveys.manage", "import.csv", "kobo.manage", "questionnaires.manage",
  "weighting.manage", "clients.manage", "quality.view", "raw.view",
];

const AuthContext = createContext<AuthValue | null>(null);
const STORAGE_KEY = "ethos.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* sessão inválida é simplesmente descartada */
    }
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!found) throw new Error("E-mail ou senha inválidos. Verifique os dados e tente novamente.");
    const { password: _pw, ...safe } = found;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    setUser(safe);
    return safe;
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthValue>(() => {
    const role: Role | undefined = user?.role;
    return {
      user,
      ready,
      isAdmin: role === "admin",
      signIn,
      signOut,
      can: (permission) => {
        if (!user) return false;
        if (permission === "export") return user.canExport;
        return role === "admin" || !ADMIN_ONLY.includes(permission);
      },
    };
  }, [user, ready, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}