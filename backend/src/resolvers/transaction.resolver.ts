import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { TransactionModel } from "../models/transaction.model";
import { IsAuth } from "../middlewares/auth.middleware";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { UserModel } from "../models/user.model";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../dtos/input/transaction.input";
import { TransactionService } from "../services/transaction.service";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { UserService } from "../services/user.service";

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService();
  private categoryService = new CategoryService();
  private userService = new UserService();

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: UserModel,
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(user.id, data);
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: UserModel,
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(user.id, id, data);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<boolean> {
    return this.transactionService.deleteTransaction(user.id, id);
  }

  @Query(() => [TransactionModel])
  async listTransactions(
    @GqlUser() user: UserModel,
  ): Promise<TransactionModel[]> {
    return this.transactionService.listTransactions(user.id);
  }

  @Query(() => TransactionModel)
  async getTransaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<TransactionModel> {
    return this.transactionService.getTransaction(user.id, id);
  }

  @FieldResolver(() => CategoryModel)
  async category(
    @Root() transaction: TransactionModel,
  ): Promise<CategoryModel> {
    return this.categoryService.findById(
      transaction.userId,
      transaction.categoryId,
    );
  }

  @FieldResolver(() => UserModel)
  async user(@Root() transaction: TransactionModel): Promise<UserModel> {
    return this.userService.findUser(transaction.userId);
  }
}
