import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';
import { SessionTypeEnum } from '../../Enums/session-type.enum';

export class GetSessionDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  StartTime: Date;

  @IsNotEmpty()
  EndTime: Date;

  holidayName?: string[];

  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(SessionTypeEnum)
  type: SessionTypeEnum;
}
