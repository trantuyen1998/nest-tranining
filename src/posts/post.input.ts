import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field({ nullable: true })
  title: string;

  @Field(() => [String], { nullable: true })
  paragraphs: string[];
}
