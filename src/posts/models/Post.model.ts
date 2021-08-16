import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from 'src/users/entity/users.entity';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];
}
