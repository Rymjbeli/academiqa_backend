import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SessionEntity } from '../../session/entities/session.entity';
import { CommonChatEntity } from '../entities/common-chat.entity';
export class DeleteCommonChatSessionDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @Type(() => SessionEntity)
  session: SessionEntity;
}
