import { Field, InputType } from "type-graphql";
import { CategoryColor, CategoryIcon } from "@prisma/client";

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => CategoryIcon)
  icon!: CategoryIcon;

  @Field(() => CategoryColor)
  color!: CategoryColor;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => CategoryIcon, { nullable: true })
  icon?: CategoryIcon;

  @Field(() => CategoryColor, { nullable: true })
  color?: CategoryColor;
}
