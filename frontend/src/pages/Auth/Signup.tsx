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
import {
  ArrowRightToLine,
  Eye,
  EyeClosed,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";

export function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const signup = useAuthStore((state) => state.signup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signupOk = await signup({
        fullname,
        email,
        password,
      });
      if (signupOk) {
        toast.success("Cadastro realizado com sucesso!");
      }
    } catch {
      toast.error("Erro ao realizar o cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center py-6">
      <div className="flex w-full max-w-[448px] flex-col items-center gap-6">
        <Brand />
        <Card className="w-full p-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-3xl font-bold text-slate-900">
              Criar conta
            </CardTitle>
            <CardDescription className="pt-1 text-center text-base">
              Comece a controlar suas finanças ainda hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Nome completo</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="fullname"
                    placeholder="Seu nome completo"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>
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
                    type={showPassword ? "text" : "password"}
                    minLength={8}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
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
                <p className="text-sm text-slate-500">
                  A senha deve ter no mínimo 8 caracteres
                </p>
              </div>
              <Button
                type="submit"
                className="h-12 w-full text-base font-medium"
                disabled={loading}
              >
                Cadastrar
              </Button>
            </form>
          </CardContent>
          <div className="px-6 pb-2 pt-1">
            <div className="relative mb-5 mt-1">
              <div className="h-px w-full bg-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-slate-500">
                ou
              </span>
            </div>
            <p className="mb-4 text-center text-slate-600">Já tem uma conta?</p>
            <Button variant="outline" className="h-12 w-full bg-white" asChild>
              <Link to="/login" className="gap-2 text-base">
                <ArrowRightToLine className="h-4 w-4" />
                Fazer login
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
