import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Agora";
  }

  if (diffInMinutes < 60) {
    return `Há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }

  if (diffInHours < 24) {
    return `Há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  if (diffInDays === 1) {
    return "Ontem";
  }

  return `Há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
}

const moneyInputFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoneyInput(value: string | number) {
  const digits = String(value).replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return moneyInputFormatter.format(Number(digits) / 100);
}

export function parseMoneyInput(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return Number.NaN;
  }

  return Number(digits) / 100;
}
