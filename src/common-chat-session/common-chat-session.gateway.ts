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
      // console.log('socket', socket);
      // console.log('message', createCommonChatSessionDto);
      // console.log('socket', this.commonChatSessionService.clientToUser[socket.id]);
      const sender = this.commonChatSessionService.clientToUser[socket.id];
      await this.commonChatSessionService.createMessage(
        createCommonChatSessionDto,
      );
      const allMessages = await this.commonChatSessionService.findAll();
      this.server.emit('message', allMessages);
      // const notification = this.notificationService.createNotification(
      //   sender,
      //   'message',
      // );
      // socket.broadcast.to(sender).emit('notify', notification);
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
  async findAllMessages(@ConnectedSocket() socket: Socket) {
    try {
      const messages = await this.commonChatSessionService.findAll();
      this.server.emit('allMessages', messages);
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
  async deleteMessage(@MessageBody(ParseIntPipe) id: number): Promise<void> {
    await this.commonChatSessionService.deleteMessage(id);
    const allMessages = await this.commonChatSessionService.findAll();
    this.server.emit('deletedMessage', allMessages);
  }
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('') sender: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    console.log('socket');
    // socket.join(room);
    console.log('this sender', sender);
    this.commonChatSessionService.clientToUser[socket.id] = sender;
  }

  @SubscribeMessage('typing')
  typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() socket: Socket,
  ): void {
    // console.log('data', data);
    // console.log('socket', socket);
    // socket.to(data.room).emit('typing', data);
    const sender = this.commonChatSessionService.clientToUser[socket.id];
    socket.broadcast.emit('typing', { sender: sender, isTyping });
  }
}
