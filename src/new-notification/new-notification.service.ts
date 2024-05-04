import { Injectable } from '@nestjs/common';
import { CreateNewNotificationDto } from './dto/create-new-notification.dto';
import { UpdateNewNotificationDto } from './dto/update-new-notification.dto';

@Injectable()
export class NewNotificationService {
  create(createNewNotificationDto: CreateNewNotificationDto) {
    return 'This action adds a new newNotification';
  }

  findAll() {
    return `This action returns all newNotification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newNotification`;
  }

  update(id: number, updateNewNotificationDto: UpdateNewNotificationDto) {
    return `This action updates a #${id} newNotification`;
  }

  remove(id: number) {
    return `This action removes a #${id} newNotification`;
  }
}
