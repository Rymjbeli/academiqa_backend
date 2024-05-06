import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CommonChatSessionService } from './common-chat-session.service';
import { CreateCommonChatSessionDto } from './dto/create-common-chat-session.dto';
import { Server, Socket } from 'socket.io';
import { CommonChatEntity } from './entities/common-chat.entity';
import { ParseIntPipe } from '@nestjs/common';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { SessionEntity } from '../session/entities/session.entity';
import { DeleteCommonChatSessionDto } from './dto/delete-common-chat-session.dto';

@WebSocketGateway(8001, { cors: '*' })
export class CommonChatSessionGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly commonChatSessionService: CommonChatSessionService,
  ) {}

  @SubscribeMessage('message')
  async CreateMessage(
    @MessageBody() createCommonChatSessionDto: CreateCommonChatSessionDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<CreateCommonChatSessionDto> {
    try {
      // console.log('socket', this.commonChatSessionService.clientToUser[socket.id]);
      const sender = this.commonChatSessionService.clientToUser[socket.id];
      const { notification, message } =
        await this.commonChatSessionService.createMessage(
          createCommonChatSessionDto,
        );
      // console.log('createCommonChatSessionDto', createCommonChatSessionDto);
      this.server.emit('message', message);
      socket.broadcast.emit('notify', notification);
      return createCommonChatSessionDto;
    } catch (error) {
      console.error('Error creating message:', error);
      socket.emit(
        'errorMessage',
        'An error occurred while creating the message',
      );
    }
  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() session: SessionEntity,
  ) {
    try {
      // console.log('session', session);
      const messages = await this.commonChatSessionService.findAll(session);
      this.server.emit('allMessages', messages, session);
      return messages;
    } catch (error) {
      console.error('Error finding messages:', error);
      socket.emit(
        'errorMessage',
        'An error occurred while creating the message',
      );
    }
  }

  @SubscribeMessage('deleteMessage')
  async deleteMessage(
    @MessageBody() data: DeleteCommonChatSessionDto,
  ): Promise<void> {
    const { id, session } = data;
    await this.commonChatSessionService.deleteMessage(+id, session);
    this.server.emit('deletedMessage', id);
  }
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody() data: { sessionId: number; user: User },
    @ConnectedSocket() socket: Socket,
  ): void {
    const { sessionId, user } = data;
    console.log('this sender', user);
    console.log('socket', sessionId);
    socket.join(sessionId?.toString());
    socket.to(sessionId?.toString()).emit('userJoined', user);
    this.commonChatSessionService.clientToUser[socket.id] = user;
  }

  @SubscribeMessage('typing')
  typing(
    @MessageBody() data: { isTyping: boolean; sessionId: number },
    @ConnectedSocket() socket: Socket,
  ): void {
    const { isTyping, sessionId } = data;
    const sender = this.commonChatSessionService.clientToUser[socket.id];
    socket
      .to(sessionId?.toString())
      .emit('typing', { sender: sender, isTyping });
  }
}
