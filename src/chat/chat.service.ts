import { AuthenticationService } from './../authentication/authentication.service';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Message from './message.entity';
import User from '../users/entity/users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user =
      await this.authenticationService.getUserFromAuthenticationToken(
        authenticationToken,
      );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async saveMessage(content: string, author: User) {
    const newMessage = await this.messagesRepository.create({
      content,
      author,
    });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }
  async getAllMessages() {
    return this.messagesRepository.find({
      relations: ['author'],
    });
  }
}
