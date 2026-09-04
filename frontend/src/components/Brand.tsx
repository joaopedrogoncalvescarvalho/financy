import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.svg";

interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2 text-primary",
        compact ? "text-[20px]" : "text-[38px]",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full",
          compact ? "h-8 w-8" : "h-11 w-11",
        )}
      >
        <img
          src={logoIcon}
          alt="Financy"
          className={cn(compact ? "h-5 w-5" : "h-6 w-6")}
        />
      </span>
      <span className="font-bold tracking-[0.12em]">FINANCY</span>
    </Link>
  );
}
