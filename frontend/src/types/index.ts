export interface User {
  id: string;
  fullname: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export type TransactionType = "income" | "expense";

export type CategoryColor =
  | "blue"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "yellow";

export type CategoryIcon =
  | "briefcaseBusiness"
  | "carFront"
  | "heartPulse"
  | "piggyBank"
  | "shoppingCart"
  | "ticket"
  | "toolCase"
  | "utensils"
  | "pawPrint"
  | "house"
  | "gift"
  | "dumbbell"
  | "bookOpen"
  | "baggageClaim"
  | "mailbox"
  | "receiptText";

export interface Category {
  id: string;
  title: string;
  description?: string | null;
  icon: CategoryIcon;
  color: CategoryColor;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  value: number;
  userId: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  description: string;
  date: string;
  value: number;
  categoryId: string;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  description?: string;
  date?: string;
  value?: number;
  categoryId?: string;
}

export interface CreateCategoryInput {
  title: string;
  description?: string;
  icon: CategoryIcon;
  color: CategoryColor;
}

export interface UpdateCategoryInput {
  title?: string;
  description?: string;
  icon?: CategoryIcon;
  color?: CategoryColor;
}
