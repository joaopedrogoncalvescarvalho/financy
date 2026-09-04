import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { Brand } from "@/components/Brand";
import { EyeOff, Lock, Mail, UserRoundPlus } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-7">
      <Brand />
      <Card className="w-full max-w-[448px] p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-3xl font-bold text-slate-900">
            Fazer login
          </CardTitle>
          <CardDescription className="pt-1 text-center text-base">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 pr-10"
                  required
                />
                <EyeOff className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-slate-500">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#CBD5E1]"
                />
                Lembrar-me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-primary"
              >
                Recuperar senha
              </button>
            </div>
            <Button
              type="submit"
              className="h-12 w-full text-base"
              disabled={loading}
            >
              Entrar
            </Button>
          </form>
        </CardContent>
        <div className="px-6 pb-2 pt-1">
          <div className="relative mb-5 mt-1">
            <div className="h-px w-full bg-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-slate-500">
              Ou
            </span>
          </div>
          <p className="mb-4 text-center text-slate-600">
            Ainda não tem uma conta?
          </p>
          <Button variant="outline" className="h-12 w-full" asChild>
            <Link to="/signup" className="gap-2 text-base">
              <UserRoundPlus className="h-4 w-4" />
              Criar conta
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
