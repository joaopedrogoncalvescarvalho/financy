import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { Brand } from "@/components/Brand";
import { Eye, EyeClosed, Lock, Mail, UserRoundPlus } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginOk = await login({
        email,
        password,
      });
      if (loginOk) {
        toast.success("Login realizado com sucesso!");
      }
    } catch {
      toast.error("Falha ao realizar o login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center bg-[#f3f4f2] px-4 py-8">
      <Brand />

      <div className="mt-7 w-full max-w-[456px] rounded-[18px] border border-[#D8E1EE] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
        <div className="mb-5 text-center">
          <h1 className="text-[29px] font-bold tracking-[-0.04em] text-slate-900">
            Fazer login
          </h1>
          <p className="mt-2 text-[16px] text-slate-500">
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-[15px] font-medium text-slate-700"
            >
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="mail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[52px] border-[#D8E1EE] bg-white pl-10 pr-3 text-[16px] text-slate-700 placeholder:text-slate-400 focus-visible:ring-0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-[15px] font-medium text-slate-700"
            >
              Senha
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[52px] border-[#D8E1EE] bg-white pl-10 pr-10 text-[16px] text-slate-700 placeholder:text-slate-400 focus-visible:ring-0"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosed className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-slate-500">
            <label className="inline-flex cursor-pointer items-center gap-2 text-[15px]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#D8E1EE] bg-white accent-[#1F6F43]"
              />
              Lembrar-me
            </label>
            <button
              type="button"
              className="text-[15px] font-medium text-[#1F6F43]"
            >
              Recuperar senha
            </button>
          </div>

          <Button
            type="submit"
            className="mt-2 h-[52px] w-full rounded-xl bg-[#1F6F43] text-[18px] font-bold text-white shadow-none hover:bg-[#1a5a3a]"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative mb-5">
            <div className="h-px w-full bg-[#D8E1EE]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[14px] tracking-[0.12em] text-slate-500">
              ou
            </span>
          </div>

          <p className="mb-4 text-center text-[16px] text-slate-600">
            Ainda não tem uma conta?
          </p>

          <Button
            variant="outline"
            className="h-[52px] w-full rounded-xl border-[#D8E1EE] bg-white text-[16px] font-medium text-slate-700 hover:bg-slate-50"
            asChild
          >
            <Link to="/signup" className="gap-2">
              <UserRoundPlus className="h-4 w-4" />
              Criar conta
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
