import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommonChatSessionDto } from './dto/create-common-chat-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonChatEntity } from './entities/common-chat.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { NotifTypeEnum } from '../Enums/notif-type.enum';

@Injectable()
export class CommonChatSessionService {
  constructor(
    @InjectRepository(CommonChatEntity)
    private readonly commonChatSessionRepository: Repository<CommonChatEntity>,
    private notificationService: NotificationService,
  ) {}
  clientToUser: any = {};

  private organizeMessages(messages: CommonChatEntity[]): any[] {
    const organizedMessages = [];
    const map = new Map();

    messages.forEach((message) => {
      map.set(message.id, { ...message, replies: [] });
    });

    messages.forEach((message) => {
      if (message.parent) {
        console.log('message.parent.id', message.parent);
        const parentMessage = map.get(message.parent.id);
        if (parentMessage) {
          parentMessage.replies.push(map.get(message.id));
        } else {
          organizedMessages.forEach((orgMessage) => {
            if (orgMessage.id === message.parent.id) {
              orgMessage.replies.push(map.get(message.id));
            }
          });
        }
      } else {
        organizedMessages.push(map.get(message.id));
      }
    });

    return organizedMessages;
  }
  private findMessageById(messages: any[], id: number): any | null {
    for (const message of messages) {
      if (message.id === id) {
        return message; // Found the message
      }
      if (message.replies && message.replies.length > 0) {
        const foundInReplies = this.findMessageById(message.replies, id);
        if (foundInReplies) {
          return foundInReplies; // Found the message in replies
        }
      }
    }
    return null;
  }
  async createMessage(createCommonChatSessionDto: CreateCommonChatSessionDto) {
    const notification = await this.notificationService.buildNotification(
      NotifTypeEnum.MESSAGE,
      'ramy',
      null,
      null,
      0,
    );
    const newMessage = this.commonChatSessionRepository.create(
      createCommonChatSessionDto,
    );
    // newMessage.author = this.clientToUser[user];
    await this.commonChatSessionRepository.save(newMessage);
    return notification;
  }
  async findAll(): Promise<any[]> {
    const chats = await this.commonChatSessionRepository.find({
      relations: ['parent'],
    });
    return this.organizeMessages(chats);
  }

  async deleteMessage(id: number) {
    const messages = await this.findAll();
    const messageToDelete = this.findMessageById(messages, id);
    if (messageToDelete) {
      await this.commonChatSessionRepository.softRemove(messageToDelete);
    } else {
      throw new NotFoundException(`Message with id ${id} not found.`);
    }
  }
}
