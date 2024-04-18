import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotifTypeEnum } from '../../Enums/notif-type.enum';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsOptional()
  broadcast: string;
  @IsNumber()
  @IsOptional()
  link: number;
  //senderImage will be taken from the logged in user
  @IsEnum(NotifTypeEnum)
  @IsNotEmpty()
  notificationType: string;
  @IsNumber()
  @IsOptional()
  receiver: number;
}
