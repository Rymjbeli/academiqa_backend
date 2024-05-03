import { SessionEntity } from '../../session/entities/session.entity';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  isDone: boolean;

  @IsNotEmpty()
  @Type(() => SessionEntity)
  session: SessionEntity;
}
