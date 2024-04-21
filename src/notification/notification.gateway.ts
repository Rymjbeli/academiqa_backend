import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
@WebSocketGateway(8001, { cors: '*' })
@WebSocketGateway()
export class NotificationGateway {
  constructor(private readonly notificationService: NotificationService) {}
  @SubscribeMessage('getAllNotifications')
  async getAllNotifications(
    @MessageBody() receiver: string,
  ): Promise<NotificationEntity[]> {
    // console.log('receiver', receiver);
    return await this.notificationService.getAllNotifications(receiver);
  }
}
