import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { categoryColorMap, categoryIconMap } from "@/lib/finance";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/lib/graphql/mutations/Category";
import type {
  Category,
  CategoryColor,
  CategoryIcon,
  CreateCategoryInput,
} from "@/types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  category?: Category | null;
  onSaved: () => void;
}

const iconOptions = Object.keys(categoryIconMap) as CategoryIcon[];
const colorOptions = Object.keys(categoryColorMap) as CategoryColor[];

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<CategoryIcon>("briefcaseBusiness");
  const [color, setColor] = useState<CategoryColor>("green");

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY);

  const loading = creating || updating;

  useEffect(() => {
    if (!open) return;

    if (category) {
      setTitle(category.title);
      setDescription(category.description ?? "");
      setIcon(category.icon);
      setColor(category.color);
      return;
    }

    setTitle("");
    setDescription("");
    setIcon("briefcaseBusiness");
    setColor("green");
  }, [open, category]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload: CreateCategoryInput = {
      title,
      description,
      icon,
      color,
    };

    try {
      if (category) {
        await updateCategory({
          variables: {
            id: category.id,
            data: payload,
          },
        });
        toast.success("Categoria atualizada");
      } else {
        await createCategory({ variables: { data: payload } });
        toast.success("Categoria criada");
      }

      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("Nao foi possivel salvar a categoria");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              className="h-12"
              placeholder="Ex. Alimentação"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              className="h-12"
              placeholder="Descrição da categoria"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <p className="text-sm text-slate-500">Opcional</p>
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-8 gap-2">
              {iconOptions.map((option) => {
                const Icon = categoryIconMap[option];
                const selected = icon === option;
                return (
                  <button
                    type="button"
                    key={option}
                    className={`flex h-10 items-center justify-center rounded-xl border transition ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-[#CBD5E1] bg-white"
                    }`}
                    onClick={() => setIcon(option)}
                  >
                    <Icon className="h-4 w-4 text-slate-600" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-7 gap-2">
              {colorOptions.map((option) => {
                const selected = color === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setColor(option)}
                    className={`h-9 rounded-xl border p-1 transition ${
                      selected ? "border-primary" : "border-[#CBD5E1]"
                    }`}
                  >
                    <span
                      className={`block h-full w-full rounded-md ${categoryColorMap[option].swatch}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={loading}
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
