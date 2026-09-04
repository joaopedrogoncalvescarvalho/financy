import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { LogOut, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";
import { ME } from "@/lib/graphql/queries/Me";
import type { User } from "@/types";

interface MeQueryData {
  me: User;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const setUserName = useAuthStore((state) => state.setUserName);
  const userFromStore = useAuthStore((state) => state.user);

  const { data, loading } = useQuery<MeQueryData>(ME);

  const [fullname, setFullname] = useState("");

  useEffect(() => {
    setFullname(data?.me.fullname || userFromStore?.fullname || "");
  }, [data?.me.fullname, userFromStore?.fullname]);

  const user = data?.me || userFromStore;

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    setUserName(fullname);
    toast.info(
      "A API atual não possui mutation para atualizar perfil. Alteração salva apenas localmente.",
    );
  };

  const leave = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto w-full max-w-[448px] rounded-2xl border border-[#D8E1EE] bg-white p-8">
      <div className="mb-8 flex flex-col items-center gap-3 border-b border-[#E2E8F0] pb-8">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-slate-200 text-3xl text-slate-700">
            {user?.fullname
              ?.split(" ")
              .map((name) => name[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-5xl font-bold leading-[1.05] text-slate-900">
          {user?.fullname || "Seu perfil"}
        </h1>
        <p className="text-lg text-slate-500">{user?.email}</p>
      </div>

      <form className="space-y-4" onSubmit={saveProfile}>
        <div className="space-y-2">
          <Label htmlFor="fullname">Nome completo</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="fullname"
              className="h-12 pl-10"
              value={fullname}
              onChange={(event) => setFullname(event.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              className="h-12 pl-10"
              value={user?.email || ""}
              disabled
            />
          </div>
          <p className="text-sm text-slate-500">
            O e-mail não pode ser alterado
          </p>
        </div>

        <Button
          type="submit"
          className="h-12 w-full text-base"
          disabled={loading || !user}
        >
          Salvar alterações
        </Button>
      </form>

      <Button
        variant="outline"
        className="mt-4 h-12 w-full gap-2 border-red-200 text-red-600 hover:bg-red-50"
        onClick={leave}
      >
        <LogOut className="h-4 w-4" /> Sair da conta
      </Button>
    </div>
  );
}
