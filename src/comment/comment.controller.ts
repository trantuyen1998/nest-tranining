import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import { CreateCommentCommand } from './command/implementations/createComment.command';
import CreateCommentDto from './dto/createComment.dto';
import GetCommentsDto from './dto/getComments.dto';
import { GetCommentsQuery } from './queries/implementations/getComments.query';

@Controller('comment')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    console.log(comment);
    const user = req.user;
    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    console.log(postId);
    return this.queryBus.execute(new GetCommentsQuery(4));
  }
}
