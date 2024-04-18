import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotifTypeEnum } from '../Enums/notif-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return await this.notificationRepository.save(notification);
  }
  async getAllNotifications(receiver: string): Promise<NotificationEntity[]> {
    // return this.notifications.filter(
    //   (notification) => notification.receiver === receiver,
    // );

    return await this.notificationRepository.find();
  }

  generateContent(notificationType: NotifTypeEnum, content: string): string {
    switch (notificationType) {
      case NotifTypeEnum.ABSENCE_LIMIT:
        return `You have reached the **absence limit** in **${content}**, please contact the administration`;
      case NotifTypeEnum.CONTENT:
        return `**New Content** has been added to **${content}**`;
      case NotifTypeEnum.MESSAGE:
        return `You have a **new message** from **${content}**`;
      case NotifTypeEnum.ABSENT:
        return `You have been marked **absent** in **${content}**`;
      case NotifTypeEnum.NEW_ANNOUNCEMENT:
        return `**${content}** added **new announcement**`;
      default:
        return `Unknown notification type: ${notificationType}`;
    }
  }
  async buildNotification(
    notificationType: NotifTypeEnum,
    content: string,
    broadcast: string,
    link: number,
    receiver: number,
  ) {
    const notifContent = this.generateContent(notificationType, content);
    const createNotificationDto: CreateNotificationDto = {
      content: notifContent,
      broadcast: broadcast,
      link: link,
      notificationType: NotifTypeEnum.MESSAGE,
      receiver: receiver,
    };
    const notification = await this.createNotification(createNotificationDto);
    console.log('notification', notification);
    return notification;
  }
  async deleteNotification(id: number): Promise<void> {
    await this.notificationRepository.softDelete(id);
  }
}
