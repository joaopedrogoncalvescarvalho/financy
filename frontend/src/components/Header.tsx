import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { Brand } from "./Brand";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (!isAuthenticated || isAuthPage) return null;

  return (
    <header className="h-[72px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="relative flex h-full w-full items-center justify-between px-4 sm:px-8 lg:px-12">
        <Brand compact />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-primary"
                : "transition hover:text-slate-900"
            }
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-primary"
                : "transition hover:text-slate-900"
            }
          >
            Transações
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-primary"
                : "transition hover:text-slate-900"
            }
          >
            Categorias
          </NavLink>
        </nav>

        <NavLink to="/profile" className="inline-flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-slate-200 text-slate-700">
              {user?.fullname
                ?.split(" ")
                .map((name) => name[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </NavLink>
      </div>
    </header>
  );
}
