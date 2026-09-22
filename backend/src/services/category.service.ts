import { prismaClient } from "../../prisma/prisma";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";

export class CategoryService {
  async createCategory(userId: string, data: CreateCategoryInput) {
    const existingCategory = await prismaClient.category.findUnique({
      where: {
        userId_title: {
          userId,
          title: data.title,
        },
      },
    });

    if (existingCategory) {
      throw new Error("Você já possui uma categoria com este título.");
    }

    return prismaClient.category.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        userId,
      },
    });
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(userId: string, id: string) {
    const category = await prismaClient.category.findFirst({
      where: { id, userId },
    });

    if (!category) throw new Error("Categoria não encontrada.");
    return category;
  }

  async updateCategory(userId: string, id: string, data: UpdateCategoryInput) {
    await this.findById(userId, id);

    if (data.title) {
      const duplicate = await prismaClient.category.findUnique({
        where: {
          userId_title: {
            userId,
            title: data.title,
          },
        },
      });

      if (duplicate && duplicate.id !== id) {
        throw new Error("Você já possui uma categoria com este título.");
      }
    }

    return prismaClient.category.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        icon: data.icon ?? undefined,
        color: data.color ?? undefined,
      },
    });
  }

  async deleteCategory(userId: string, id: string) {
    await this.findById(userId, id);
    await prismaClient.category.delete({ where: { id } });
    return true;
  }
}
