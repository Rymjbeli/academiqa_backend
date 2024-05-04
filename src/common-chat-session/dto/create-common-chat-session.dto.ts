import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SessionEntity } from '../../session/entities/session.entity';
import { CommonChatEntity } from '../entities/common-chat.entity';
import { User } from '../../user/entities/user.entity';
export class CreateCommonChatSessionDto {
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsOptional()
  parent: CommonChatEntity;
  @Type(() => SessionEntity)
  @IsNotEmpty()
  session: SessionEntity;
  @IsNotEmpty()
  author: User;
}
