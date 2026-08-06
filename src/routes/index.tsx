import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EthosLogoLight } from "@/components/brand/EthosLogo";
import { DEMO_CREDENTIALS, useAuth } from "@/lib/auth";
import { CONFIDENTIALITY_NOTE } from "@/lib/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — Painel de Inteligência Eleitoral | Ethos" },
      {
        name: "description",
        content:
          "Acesso restrito ao painel de inteligência eleitoral da Ethos Institucional.",
      },
      { property: "og:title", content: "Entrar — Painel de Inteligência Eleitoral | Ethos" },
      {
        property: "og:description",
        content: "Acesso restrito a usuários autorizados pela Ethos Institucional.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) navigate({ to: "/visao-geral", replace: true });
  }, [ready, user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const logged = await signIn(email, password);
      toast.success(`Bem-vindo(a), ${logged.name}.`);
      navigate({ to: "/visao-geral", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_46%]">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <EthosLogoLight />
          <h1 className="mt-10 font-display text-3xl text-foreground">
            Painel de Inteligência Eleitoral
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesso restrito a usuários autorizados pela Ethos Institucional.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@ethosinstitucional.com.br"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Entrar no painel"}
            </Button>
            <button
              type="button"
              onClick={() =>
                toast.info("Solicite a redefinição ao administrador da Ethos Institucional.")
              }
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Esqueci minha senha
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-border bg-card p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Acessos de demonstração
            </p>
            <ul className="mt-2 space-y-1">
              {DEMO_CREDENTIALS.map((c) => (
                <li key={c.email}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(c.email);
                      setPassword(c.password);
                    }}
                    className="w-full rounded-md px-2 py-1 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {c.role === "admin" ? "Administrador" : "Cliente"} · {c.email} / {c.password}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 flex items-start gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            {CONFIDENTIALITY_NOTE}
          </p>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-[color:var(--ink)] lg:block">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--gold) 0, transparent 45%), radial-gradient(circle at 80% 70%, var(--gold-light) 0, transparent 40%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary">
            Ethos Institucional
          </p>
          <div>
            <p className="font-display text-4xl leading-tight text-white">
              Pesquisa, precisão e leitura política de Rondônia.
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Consolidação de pesquisas por município, onda e questionário, com ponderação
              auditável e cruzamentos demográficos.
            </p>
          </div>
          <div className="flex gap-8 border-t border-white/10 pt-6 text-white/70">
            {[
              ["52", "municípios mapeados"],
              ["24", "pesquisas demonstrativas"],
              ["3", "ondas de campo"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-semibold text-primary">{n}</p>
                <p className="text-[11px] uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
