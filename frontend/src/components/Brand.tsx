import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center justify-center text-primary",
        compact ? "h-8" : "h-12",
      )}
    >
      <img
        src={logo}
        alt="Financy"
        className={cn(
          "select-none object-contain",
          compact ? "h-6 w-auto" : "h-9 w-auto",
        )}
      />
    </Link>
  );
}
