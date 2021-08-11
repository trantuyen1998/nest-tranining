import { GetCommentsHandler } from './queries/handler/getComments.handler';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCommentHandler } from './command/handler/createComment.handler';
import { CommentController } from './comment.controller';
import Comment from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  controllers: [CommentController],
  providers: [CreateCommentHandler, GetCommentsHandler],
})
export class CommentModule {}
