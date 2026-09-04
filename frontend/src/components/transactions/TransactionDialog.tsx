import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ArrowDownCircle, ArrowUpCircle, CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  categoryColorMap,
  categoryIconMap,
  toDateInputValue,
  transactionTypeLabel,
} from "@/lib/finance";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
} from "@/lib/graphql/mutations/Transaction";
import type {
  Category,
  CreateTransactionInput,
  Transaction,
  TransactionType,
} from "@/types";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  categories: Category[];
  transaction?: Transaction | null;
  onSaved: () => void;
}

export function TransactionDialog({
  open,
  onOpenChange,
  categories,
  transaction,
  onSaved,
}: TransactionDialogProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [createTransaction, { loading: creating }] =
    useMutation(CREATE_TRANSACTION);
  const [updateTransaction, { loading: updating }] =
    useMutation(UPDATE_TRANSACTION);

  const loading = creating || updating;
  const isEditMode = Boolean(transaction);

  useEffect(() => {
    if (!open) return;

    if (transaction) {
      setType(transaction.type);
      setDescription(transaction.description);
      setDate(toDateInputValue(transaction.date));
      setValue(String(transaction.value));
      setCategoryId(transaction.categoryId);
      return;
    }

    setType("expense");
    setDescription("");
    setDate("");
    setValue("");
    setCategoryId("");
  }, [open, transaction, categories]);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === categoryId),
    [categories, categoryId],
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!categoryId) {
      toast.error("Selecione uma categoria");
      return;
    }

    if (!date) {
      toast.error("Selecione uma data");
      return;
    }

    const parsedValue = Number(value.replace(",", "."));
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      toast.error("Informe um valor valido");
      return;
    }

    const payload: CreateTransactionInput = {
      type,
      description,
      date: new Date(date).toISOString(),
      value: parsedValue,
      categoryId,
    };

    try {
      if (transaction) {
        await updateTransaction({
          variables: {
            id: transaction.id,
            data: payload,
          },
        });
        toast.success("Transação atualizada");
      } else {
        await createTransaction({
          variables: {
            data: payload,
          },
        });
        toast.success("Transação criada");
      }

      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível salvar a transação");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        {!categories.length ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-slate-500">
            Crie ao menos uma categoria antes de adicionar transações.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border p-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex h-12 items-center justify-center gap-2 rounded-lg border text-base ${
                  type === "expense"
                    ? "border-[#EF4444] text-[#EF4444]"
                    : "border-transparent text-slate-500"
                }`}
              >
                <ArrowDownCircle className="h-4 w-4" />
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex h-12 items-center justify-center gap-2 rounded-lg border text-base ${
                  type === "income"
                    ? "border-[#16A34A] text-[#16A34A]"
                    : "border-transparent text-slate-500"
                }`}
              >
                <ArrowUpCircle className="h-4 w-4" />
                Receita
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                className="h-12"
                placeholder="Ex. Almoço no restaurante"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    className="h-12 pr-10"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-slate-800">
                    R$
                  </span>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    step="0.01"
                    className="h-12 pl-12"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>

              {selectedCategory ? (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {(() => {
                    const Icon = categoryIconMap[selectedCategory.icon];
                    return (
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${categoryColorMap[selectedCategory.color].iconBox}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    );
                  })()}
                  <span>
                    {selectedCategory.title} · {transactionTypeLabel[type]}
                  </span>
                </div>
              ) : null}
            </div>

            <Button
              type="submit"
              className="h-12 w-full text-base"
              disabled={loading}
            >
              Salvar
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
