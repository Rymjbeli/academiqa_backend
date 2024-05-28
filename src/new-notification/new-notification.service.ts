import { Injectable } from '@nestjs/common';
import { CreateNewNotificationDto } from './dto/create-new-notification.dto';
import { UpdateNewNotificationDto } from './dto/update-new-notification.dto';
import { Repository } from 'typeorm';
import { NewNotificationEntity } from './entities/new-notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotifTypeEnum } from '../Enums/notif-type.enum';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NewNotificationService {
  constructor(
    @InjectRepository(NewNotificationEntity)
    private notificationRepository: Repository<NewNotificationEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createNotification(
    createNotificationDto: CreateNewNotificationDto,
  ): Promise<NewNotificationEntity> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return await this.notificationRepository.save(notification);
  }
  async getAllNotifications(
    receiver: string,
  ): Promise<NewNotificationEntity[]> {
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
        return `****${content}** has added **new Content**`;
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
    senderImage: string,
    sender: number,
  ) {
    const notifContent = this.generateContent(notificationType, content);
    const createNotificationDto: CreateNewNotificationDto = {
      content: notifContent,
      broadcast: broadcast,
      link: link,
      notificationType: notificationType,
      receiver: receiver,
      senderImage: senderImage,
      sender: sender,
    };
    const notification = await this.createNotification(createNotificationDto);
    // //console.log('notification', notification);
    return notification;
  }
  async deleteNotification(id: number): Promise<void> {
    await this.notificationRepository.softDelete(id);
  }
  userNotificationStream(receiver: number) {
    const activeObservers = new Set();
    return new Observable<CreateNewNotificationDto>((observer) => {
      if (activeObservers.has(receiver)) {
        // Return if observer for this receiver is already active
        return;
      }
      activeObservers.add(receiver);
      // //console.log('receiver', receiver);

      const eventListener = async (data) => {
        //console.log('receiver', receiver);
        //console.log('receiver', data.sender);
        //console.log(typeof data.sender);
        //console.log(typeof receiver);
        observer.next(data);
      };

      this.eventEmitter.on('notify', eventListener);

      // Clean up the observer and event listener when the observable completes
      return () => {
        this.eventEmitter.off('notify', eventListener);
        activeObservers.delete(receiver);
      };
    });
  }
}
