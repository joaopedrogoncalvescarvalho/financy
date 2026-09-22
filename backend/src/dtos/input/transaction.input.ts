import { Field, Float, GraphQLISODateTime, InputType } from "type-graphql";
import { TransactionType } from "@prisma/client";

@InputType()
export class CreateTransactionInput {
  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  description!: string;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => Float)
  value!: number;

  @Field(() => String)
  categoryId!: string;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;

  @Field(() => Float, { nullable: true })
  value?: number;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}
