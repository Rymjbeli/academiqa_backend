import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse, Query
} from "@nestjs/common";
import { NewNotificationService } from './new-notification.service';
import { CreateNewNotificationDto } from './dto/create-new-notification.dto';
import { UpdateNewNotificationDto } from './dto/update-new-notification.dto';
import { map } from 'rxjs';

@Controller('new-notification')
export class NewNotificationController {
  constructor(
    private readonly newNotificationService: NewNotificationService,
  ) {}
  @Get()
  async findAll(@Body() receiver: string) {
    return await this.newNotificationService.getAllNotifications(receiver);
  }
  @Sse('events-for-user')
  sseEvents(@Query('receiver') receiver: number) {
    return this.newNotificationService
      .userNotificationStream(receiver)
      .pipe(map((notification) => ({ data: notification })));
  }
}
