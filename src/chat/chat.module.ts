import { ChatGateway } from './chat.gateway';
import { AuthenticationModule } from './../authentication/authentication.module';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './message.entity';

@Module({
  imports: [AuthenticationModule],
  providers: [ChatService, ChatGateway],
  controllers: [],
})
export class ChatModule {}
