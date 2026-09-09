import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Edit,
  Plus,
  Search,
  Trash,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/Transaction";
import {
  categoryColorMap,
  categoryIconMap,
  formatMoney,
  getMonthKey,
  shortDateFormatter,
  toMonthLabel,
  transactionTypeLabel,
} from "@/lib/finance";
import type { Category, Transaction, TransactionType } from "@/types";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";

interface TransactionsQueryData {
  listTransactions: Transaction[];
}

interface CategoriesQueryData {
  listCategories: Category[];
}

const PAGE_SIZE = 8;

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const transactionsQuery = useQuery<TransactionsQueryData>(LIST_TRANSACTIONS);
  const categoriesQuery = useQuery<CategoriesQueryData>(LIST_CATEGORIES);
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

  const transactions = useMemo(
    () =>
      [...(transactionsQuery.data?.listTransactions ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [transactionsQuery.data],
  );

  const categories = categoriesQuery.data?.listCategories ?? [];

  const monthOptions = useMemo(() => {
    const values = new Set<string>();
    for (const item of transactions) {
      values.add(getMonthKey(item.date));
    }
    return Array.from(values).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const filtered = transactions.filter((item) => {
    const normalizedSearch = search.trim().toLowerCase();
    const itemMonth = getMonthKey(item.date);

    if (
      normalizedSearch &&
      !item.description.toLowerCase().includes(normalizedSearch)
    ) {
      return false;
    }

    if (typeFilter !== "all" && item.type !== typeFilter) {
      return false;
    }

    if (categoryFilter !== "all" && item.categoryId !== categoryFilter) {
      return false;
    }

    if (monthFilter !== "all" && itemMonth !== monthFilter) {
      return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNumbers = useMemo(() => {
    const spread = 1;
    const start = Math.max(1, page - spread);
    const end = Math.min(totalPages, page + spread);
    const values: number[] = [];
    for (let i = start; i <= end; i++) values.push(i);
    return values;
  }, [page, totalPages]);

  const refresh = () => {
    void transactionsQuery.refetch();
    void categoriesQuery.refetch();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja mesmo remover esta transação?")) return;

    try {
      await deleteTransaction({ variables: { id } });
      toast.success("Transação removida");
      refresh();
    } catch {
      toast.error("Não foi possível remover a transação");
    }
  };

  const loading = transactionsQuery.loading || categoriesQuery.loading;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[48px] font-bold leading-[1.08] text-slate-900">
            Transações
          </h1>
          <p className="mt-1 text-slate-600">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <Button
          className="h-11 gap-2"
          onClick={() => {
            setSelectedTransaction(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nova transação
        </Button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-[#D8E1EE] bg-white p-5 md:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Buscar</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-12 pl-10"
              placeholder="Buscar por descrição"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Tipo</span>
          <select
            className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value as "all" | TransactionType);
              setCurrentPage(1);
            }}
          >
            <option value="all">Todos</option>
            <option value="income">Entrada</option>
            <option value="expense">Saída</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Categoria</span>
          <select
            className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Periodo</span>
          <select
            className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={monthFilter}
            onChange={(event) => {
              setMonthFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Todos</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {toMonthLabel(month)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b text-left text-sm uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-medium">Descrição</th>
                <th className="px-5 py-4 font-medium">Data</th>
                <th className="px-5 py-4 font-medium">Categoria</th>
                <th className="px-5 py-4 font-medium">Tipo</th>
                <th className="px-5 py-4 text-right font-medium">Valor</th>
                <th className="px-5 py-4 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-slate-500" colSpan={6}>
                    Carregando...
                  </td>
                </tr>
              ) : null}

              {!loading && pageItems.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-8 text-center text-sm text-slate-500"
                    colSpan={6}
                  >
                    Nenhuma transação encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : null}

              {pageItems.map((item) => {
                const category = item.category;
                const palette = category
                  ? categoryColorMap[category.color]
                  : null;
                const Icon = category
                  ? categoryIconMap[category.icon]
                  : WalletCards;

                return (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${palette?.iconBox ?? "bg-slate-100 text-slate-600"}`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-medium text-slate-900">
                          {item.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {shortDateFormatter.format(new Date(item.date))}
                    </td>
                    <td className="px-5 py-4">
                      {category ? (
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm ${palette?.badge}`}
                        >
                          {category.title}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-500">
                          Sem categoria
                        </span>
                      )}
                    </td>
                    <td
                      className={
                        item.type === "income"
                          ? "px-5 py-4 text-emerald-700"
                          : "px-5 py-4 text-red-600"
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        {item.type === "income" ? (
                          <CircleArrowUp className="h-4 w-4" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4" />
                        )}
                        {transactionTypeLabel[item.type]}
                      </span>
                    </td>
                    <td
                      className={
                        item.type === "income"
                          ? "px-5 py-4 text-right font-semibold text-emerald-700"
                          : "px-5 py-4 text-right font-semibold text-red-600"
                      }
                    >
                      {formatMoney(item.value, item.type)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="bg-white text-red-600 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedTransaction(item);
                            setDialogOpen(true);
                          }}
                          className="bg-white hover:bg-slate-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-4">
          <span className="text-sm text-slate-600">
            {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} a{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} | {filtered.length}{" "}
            resultados
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setCurrentPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setCurrentPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        transaction={selectedTransaction}
        onSaved={refresh}
      />
    </div>
  );
}
