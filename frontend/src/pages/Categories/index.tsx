import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpDown, Edit, Plus, Tag, Trash } from "lucide-react";
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
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-700">
              <Tag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[1.9rem] font-bold leading-none text-slate-900">
                {categories.length}
              </p>
              <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                Total de categorias
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-violet-600">
              <ArrowUpDown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[1.9rem] font-bold leading-none text-slate-900">
                {transactions.length}
              </p>
              <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                Total de transações
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#D8E1EE] bg-white p-6">
          {mostUsedCategory ? (
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg`}
              >
                {(() => {
                  const Icon = categoryIconMap[mostUsedCategory.icon];
                  return <Icon className="h-5 w-5" />;
                })()}
              </span>

              <div className="flex-1">
                <p className="text-[1.9rem] font-bold leading-none text-slate-900">
                  {mostUsedCategory.title}
                </p>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                  Categoria mais utilizada
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
                      className="bg-white text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(category);
                        setDialogOpen(true);
                      }}
                      className="bg-white hover:bg-slate-50"
                    >
                      <Edit className="h-4 w-4" />
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
