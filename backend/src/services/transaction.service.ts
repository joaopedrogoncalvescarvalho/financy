import { prismaClient } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../dtos/input/transaction.input";

export class TransactionService {
  private async validateCategoryOwnership(userId: string, categoryId: string) {
    const category = await prismaClient.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada para este usuário.");
    }
  }

  async createTransaction(userId: string, data: CreateTransactionInput) {
    await this.validateCategoryOwnership(userId, data.categoryId);

    return prismaClient.transaction.create({
      data: {
        type: data.type,
        description: data.description,
        date: data.date,
        value: data.value,
        categoryId: data.categoryId,
        userId,
      },
    });
  }

  async listTransactions(userId: string) {
    return prismaClient.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  }

  async getTransaction(userId: string, id: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) throw new Error("Transação não encontrada.");
    return transaction;
  }

  async updateTransaction(
    userId: string,
    id: string,
    data: UpdateTransactionInput,
  ) {
    await this.getTransaction(userId, id);

    if (data.categoryId) {
      await this.validateCategoryOwnership(userId, data.categoryId);
    }

    return prismaClient.transaction.update({
      where: { id },
      data: {
        type: data.type ?? undefined,
        description: data.description ?? undefined,
        date: data.date ?? undefined,
        value: data.value ?? undefined,
        categoryId: data.categoryId ?? undefined,
      },
    });
  }

  async deleteTransaction(userId: string, id: string) {
    await this.getTransaction(userId, id);
    await prismaClient.transaction.delete({ where: { id } });
    return true;
  }
}
