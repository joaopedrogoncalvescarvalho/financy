import {
  BookOpen,
  Briefcase,
  CakeSlice,
  Car,
  CreditCard,
  Footprints,
  Gift,
  HeartPulse,
  Home,
  PartyPopper,
  PiggyBank,
  ReceiptText,
  ShoppingBasket,
  ShoppingCart,
  Ticket,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type {
  Category,
  CategoryColor,
  CategoryIcon,
  Transaction,
  TransactionType,
} from "@/types";

export const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

export const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

export const transactionTypeLabel: Record<TransactionType, string> = {
  income: "Entrada",
  expense: "Saída",
};

export const categoryIconMap: Record<CategoryIcon, LucideIcon> = {
  briefcase: Briefcase,
  car: Car,
  heartPulse: HeartPulse,
  piggyBank: PiggyBank,
  shoppingCart: ShoppingCart,
  ticket: Ticket,
  creditCard: CreditCard,
  utensilsCrossed: UtensilsCrossed,

  //
  house: Home,
  gift: Gift,
  //
  basket: ShoppingBasket,
  bookOpen: BookOpen,
  cakeSlice: CakeSlice,
  footprints: Footprints,
  partyPopper: PartyPopper,
  receiptText: ReceiptText,
};

export const categoryColorMap: Record<
  CategoryColor,
  { badge: string; iconBox: string; swatch: string }
> = {
  blue: {
    badge: "bg-[#DBEAFE] text-[#2563EB]",
    iconBox: "bg-[#DBEAFE] text-[#2563EB]",
    swatch: "bg-[#3B82F6]",
  },
  green: {
    badge: "bg-[#D1FAE5] text-[#16A34A]",
    iconBox: "bg-[#D1FAE5] text-[#16A34A]",
    swatch: "bg-[#10B981]",
  },
  orange: {
    badge: "bg-[#FFEDD5] text-[#EA580C]",
    iconBox: "bg-[#FFEDD5] text-[#EA580C]",
    swatch: "bg-[#F97316]",
  },
  pink: {
    badge: "bg-[#FCE7F3] text-[#DB2777]",
    iconBox: "bg-[#FCE7F3] text-[#DB2777]",
    swatch: "bg-[#EC4899]",
  },
  purple: {
    badge: "bg-[#EDE9FE] text-[#7C3AED]",
    iconBox: "bg-[#EDE9FE] text-[#7C3AED]",
    swatch: "bg-[#8B5CF6]",
  },
  red: {
    badge: "bg-[#FEE2E2] text-[#EF4444]",
    iconBox: "bg-[#FEE2E2] text-[#EF4444]",
    swatch: "bg-[#EF4444]",
  },
  yellow: {
    badge: "bg-[#FEF9C3] text-[#CA8A04]",
    iconBox: "bg-[#FEF9C3] text-[#CA8A04]",
    swatch: "bg-[#EAB308]",
  },
};

export function formatMoney(value: number, type?: TransactionType) {
  const signed = type === "expense" ? -Math.abs(value) : Math.abs(value);
  return signed >= 0
    ? `+ ${moneyFormatter.format(signed)}`
    : `- ${moneyFormatter.format(Math.abs(signed))}`;
}

export function getCalendarDate(dateIso: string) {
  const [year, month, day] = dateIso.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getMonthKey(dateIso: string) {
  const date = getCalendarDate(dateIso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function toDateInputValue(dateIso: string) {
  return dateIso.slice(0, 10);
}

export function formatCalendarDate(dateIso: string) {
  return shortDateFormatter.format(getCalendarDate(dateIso));
}

export function toMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const text = monthFormatter.format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function summarizeByCategory(
  categories: Category[],
  transactions: Transaction[],
) {
  const grouped = new Map<string, { count: number; total: number }>();

  for (const item of transactions) {
    const previous = grouped.get(item.categoryId) ?? { count: 0, total: 0 };
    grouped.set(item.categoryId, {
      count: previous.count + 1,
      total:
        previous.total +
        (item.type === "expense"
          ? -Math.abs(item.value)
          : Math.abs(item.value)),
    });
  }

  return categories.map((category) => {
    const summary = grouped.get(category.id) ?? { count: 0, total: 0 };
    return {
      category,
      count: summary.count,
      total: summary.total,
    };
  });
}
