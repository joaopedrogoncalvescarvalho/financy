import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import { CategoryColor, CategoryIcon } from "@prisma/client";
import { UserModel } from "./user.model";

registerEnumType(CategoryIcon, {
  name: "CategoryIcon",
  description: "Icon used to represent a category",
});

registerEnumType(CategoryColor, {
  name: "CategoryColor",
  description: "Color used to represent a category",
});

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => CategoryIcon)
  icon!: CategoryIcon;

  @Field(() => CategoryColor)
  color!: CategoryColor;

  @Field(() => String)
  userId!: string;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
