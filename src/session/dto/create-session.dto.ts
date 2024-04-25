import { IsNotEmpty, IsString } from 'class-validator';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';

export class CreateSessionDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  endTime: Date;

  holidayName: string[];

  sessionType: SessionTypeEntity;
}
