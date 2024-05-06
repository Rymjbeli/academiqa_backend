import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotifTypeEnum } from '../../Enums/notif-type.enum';

export class CreateNewNotificationDto {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsOptional()
  broadcast: string;
  @IsNumber()
  @IsOptional()
  link: number;
  @IsString()
  @IsOptional()
  senderImage: string;
  @IsEnum(NotifTypeEnum)
  @IsNotEmpty()
  notificationType: string;
  @IsNumber()
  @IsOptional()
  receiver: number;
  @IsNumber()
  @IsOptional()
  sender: number;

}
