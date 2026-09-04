import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpDown, Edit2, Plus, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/Category";
import { CategoryDialog } from "@/components/categories/CategoryDialog";
import { categoryColorMap, categoryIconMap } from "@/lib/finance";
import type { Category, Transaction } from "@/types";

interface CategoriesQueryData {
  listCategories: Category[];
}

interface TransactionsQueryData {
  listTransactions: Transaction[];
}

export function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const categoriesQuery = useQuery<CategoriesQueryData>(LIST_CATEGORIES);
  const transactionsQuery = useQuery<TransactionsQueryData>(LIST_TRANSACTIONS);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const categories = categoriesQuery.data?.listCategories ?? [];
  const transactions = transactionsQuery.data?.listTransactions ?? [];

  const usageMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const transaction of transactions) {
      map.set(
        transaction.categoryId,
        (map.get(transaction.categoryId) ?? 0) + 1,
      );
    }
    return map;
  }, [transactions]);

  const mostUsedCategory = useMemo(() => {
    if (!categories.length) return null;

    return [...categories].sort(
      (a, b) => (usageMap.get(b.id) ?? 0) - (usageMap.get(a.id) ?? 0),
    )[0];
  }, [categories, usageMap]);

  const refresh = () => {
    void categoriesQuery.refetch();
    void transactionsQuery.refetch();
  };

  const removeCategory = async (id: string) => {
    if (!window.confirm("Deseja mesmo remover esta categoria?")) return;

    try {
      await deleteCategory({ variables: { id } });
      toast.success("Categoria removida");
      refresh();
    } catch {
      toast.error("Não foi possível remover a categoria");
    }
  };

  const loading = categoriesQuery.loading || transactionsQuery.loading;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-5xl font-bold leading-[1.08] text-slate-900">
            Categorias
          </h1>
          <p className="mt-1 text-slate-600">
            Organize suas transações por categorias
          </p>
        </div>

        <Button
          className="h-11 gap-2"
          onClick={() => {
            setSelectedCategory(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nova categoria
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          <p className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-slate-500">
            <Tags className="h-4 w-4" /> Total de categorias
          </p>
          <p className="text-5xl font-bold leading-none text-slate-900">
            {categories.length}
          </p>
        </article>

        <article className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          <p className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-slate-500">
            <ArrowUpDown className="h-4 w-4 text-violet-600" /> Total de
            transações
          </p>
          <p className="text-5xl font-bold leading-none text-slate-900">
            {transactions.length}
          </p>
        </article>

        <article className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          <p className="mb-2 text-sm uppercase tracking-[0.1em] text-slate-500">
            Categoria mais utilizada
          </p>
          {mostUsedCategory ? (
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                  categoryColorMap[mostUsedCategory.color].iconBox
                }`}
              >
                {(() => {
                  const Icon = categoryIconMap[mostUsedCategory.icon];
                  return <Icon className="h-5 w-5" />;
                })()}
              </span>
              <div>
                <p className="text-5xl font-bold leading-none text-slate-900">
                  {mostUsedCategory.title}
                </p>
                <p className="text-sm text-slate-500">
                  {usageMap.get(mostUsedCategory.id) ?? 0} itens
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sem dados ainda</p>
          )}
        </article>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#D8E1EE] bg-white p-8 text-sm text-slate-500">
          Carregando...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = categoryIconMap[category.icon];
            const palette = categoryColorMap[category.color];
            const count = usageMap.get(category.id) ?? 0;

            return (
              <article
                key={category.id}
                className="rounded-2xl border border-[#D8E1EE] bg-white p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${palette.iconBox}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => removeCategory(category.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(category);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-3xl font-semibold text-slate-900">
                  {category.title}
                </h3>
                <p className="mt-2 min-h-12 text-slate-600">
                  {category.description || "Sem descricao"}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm ${palette.badge}`}
                  >
                    {category.title}
                  </span>
                  <span className="text-sm text-slate-600">
                    {count} {count === 1 ? "item" : "itens"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSaved={refresh}
      />
    </div>
  );
}
