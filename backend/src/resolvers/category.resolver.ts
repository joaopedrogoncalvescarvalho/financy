import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { CategoryModel } from "../models/category.model";
import { IsAuth } from "../middlewares/auth.middleware";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { UserModel } from "../models/user.model";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";
import { CategoryService } from "../services/category.service";
import { UserService } from "../services/user.service";

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService();
  private userService = new UserService();

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: UserModel,
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(user.id, data);
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: UserModel,
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(user.id, id, data);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<boolean> {
    return this.categoryService.deleteCategory(user.id, id);
  }

  @Query(() => [CategoryModel])
  async listCategories(@GqlUser() user: UserModel): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(user.id);
  }

  @Query(() => CategoryModel)
  async getCategory(
    @Arg("id", () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<CategoryModel> {
    return this.categoryService.findById(user.id, id);
  }

  @FieldResolver(() => UserModel)
  async user(@Root() category: CategoryModel): Promise<UserModel> {
    return this.userService.findUser(category.userId);
  }
}
