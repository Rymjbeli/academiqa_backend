import { PartialType } from '@nestjs/mapped-types';
import { CreateNewNotificationDto } from './create-new-notification.dto';

export class UpdateNewNotificationDto extends PartialType(CreateNewNotificationDto) {}
