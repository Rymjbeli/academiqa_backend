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
  notifications: any[] = [
    {
      id: 1,
      content:
        'You have reached the **absence limit** in **Co Design**, please contact the administration',
      type: 'absence-limit',
      receiver: '1',
      senderImage: 'administration.svg',
    },
    {
      id: 2,
      content: 'New Content has been added to **Web Development**',
      type: 'content',
      receiver: '1',
      senderImage: 'Sellaouti.jpg',
    },
    {
      id: 3,
      content: 'You have a new message from **Abderrahmane Benghazi**',
      type: 'message',
      receiver: '1',
      senderImage: 'Sellaouti.jpg',
    },
    {
      id: 4,
      content: 'You have been marked **absent** in **Co design**',
      type: 'absent',
      receiver: '1',
      senderImage: 'administration.svg',
    },
    {
      id: 5,
      content: '**Aymen Sellaouti** added new announcement',
      type: 'new-announcement',
      receiver: '1',
      senderImage: 'Sellaouti.jpg',
    },
  ];

  // createNotification(sender, type) {
  //   const notification = {
  //     id: this.notifications.length + 1,
  //     content: 'You have a new message from **' + sender + '**',
  //     type: type,
  //     receiver: '1',
  //     senderImage: 'Sellaouti.jpg',
  //   };
  //   this.notifications.push(notification);
  //   return notification;
  // }
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
