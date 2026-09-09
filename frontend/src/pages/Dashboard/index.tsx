import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import {
  CircleArrowDown,
  CircleArrowUp,
  ArrowRight,
  Plus,
  WalletCards,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import {
  formatMoney,
  getMonthKey,
  moneyFormatter,
  shortDateFormatter,
  summarizeByCategory,
  categoryColorMap,
  categoryIconMap,
} from "@/lib/finance";
import type { Category, Transaction } from "@/types";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";

interface TransactionsQueryData {
  listTransactions: Transaction[];
}

interface CategoriesQueryData {
  listCategories: Category[];
}

export function DashboardPage() {
  const [openDialog, setOpenDialog] = useState(false);

  const transactionsQuery = useQuery<TransactionsQueryData>(LIST_TRANSACTIONS);
  const categoriesQuery = useQuery<CategoriesQueryData>(LIST_CATEGORIES);

  const transactions = useMemo(
    () =>
      [...(transactionsQuery.data?.listTransactions ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [transactionsQuery.data],
  );

  const categories = categoriesQuery.data?.listCategories ?? [];

  const balance = transactions.reduce(
    (acc, item) => acc + (item.type === "income" ? item.value : -item.value),
    0,
  );

  const currentMonthKey = getMonthKey(new Date().toISOString());
  const monthTransactions = transactions.filter(
    (item) => getMonthKey(item.date) === currentMonthKey,
  );

  const monthIncome = monthTransactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.value, 0);

  const monthExpense = monthTransactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.value, 0);

  const recentTransactions = transactions.slice(0, 5);

  const topCategories = summarizeByCategory(categories, transactions)
    .filter((item) => item.count > 0)
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
    .slice(0, 5);

  const loading = transactionsQuery.loading || categoriesQuery.loading;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          <p className="mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500">
            <WalletCards className="h-4 w-4 text-violet-600" /> Saldo total
          </p>
          <p className="text-4xl font-bold text-slate-900">
            {moneyFormatter.format(balance)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          <p className="mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500">
            <ArrowUpCircle className="h-4 w-4 text-emerald-600" /> Receitas do
            mês
          </p>
          <p className="text-4xl font-bold text-slate-900">
            {moneyFormatter.format(monthIncome)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          <p className="mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500">
            <ArrowDownCircle className="h-4 w-4 text-red-600" /> Despesas do mês
          </p>
          <p className="text-4xl font-bold text-slate-900">
            {moneyFormatter.format(monthExpense)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white lg:col-span-2">
          <header className="flex items-center justify-between border-b p-6">
            <h2 className="text-sm uppercase tracking-wide text-slate-500">
              Transações recentes
            </h2>
            <Link
              to="/transactions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          {loading ? (
            <p className="p-6 text-sm text-slate-500">Carregando...</p>
          ) : (
            <ul>
              {recentTransactions.map((item) => {
                const category = item.category;
                const palette = category
                  ? categoryColorMap[category.color]
                  : null;
                const Icon = category
                  ? categoryIconMap[category.icon]
                  : WalletCards;

                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between border-b px-6 py-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${palette?.iconBox ?? "bg-slate-100 text-slate-700"}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.description}
                        </p>
                        <p className="text-sm text-slate-500">
                          {shortDateFormatter.format(new Date(item.date))}
                        </p>
                      </div>
                    </div>

                    <div className="grid auto-cols-max grid-flow-col items-center justify-end gap-16 text-right">
                      {category ? (
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm ${palette?.badge}`}
                        >
                          {category.title}
                        </span>
                      ) : null}
                      <p
                        className={
                          item.type === "income"
                            ? "inline-flex items-center gap-2 font-semibold text-emerald-700"
                            : "inline-flex items-center gap-2 font-semibold text-red-600"
                        }
                      >
                        {formatMoney(item.value, item.type)}
                        {item.type === "income" ? (
                          <CircleArrowUp className="h-4 w-4" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4" />
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t p-4">
            <Button
              onClick={() => setOpenDialog(true)}
              variant="ghost"
              className="mx-auto flex h-10 gap-2 text-primary"
            >
              <Plus className="h-4 w-4" /> Nova transação
            </Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white">
          <header className="flex items-center justify-between border-b p-6">
            <h2 className="text-sm uppercase tracking-wide text-slate-500">
              Categorias
            </h2>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Gerenciar <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          <ul className="space-y-4 p-6">
            {topCategories.length ? (
              topCategories.map((item) => {
                const palette = categoryColorMap[item.category.color];
                return (
                  <li
                    key={item.category.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-sm"
                  >
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 ${palette.badge}`}
                    >
                      {item.category.title}
                    </span>
                    <span className="text-slate-500">{item.count} itens</span>
                    <span className="font-semibold text-slate-900">
                      {moneyFormatter.format(Math.abs(item.total))}
                    </span>
                  </li>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">
                Nenhuma categoria com movimentacao ainda.
              </p>
            )}
          </ul>
        </section>
      </div>

      <TransactionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        categories={categories}
        onSaved={() => {
          void transactionsQuery.refetch();
          void categoriesQuery.refetch();
        }}
      />
    </div>
  );
}
