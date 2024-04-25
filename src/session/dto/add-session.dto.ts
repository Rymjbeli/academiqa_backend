import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';
import { SessionTypeEnum } from '../../Enums/session-type.enum';

export class AddSessionDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  endTime: Date;

  @IsNotEmpty()
  @IsEnum(SessionTypeEnum)
  type: SessionTypeEnum;

  @IsNotEmpty()
  @IsString()
  name: string;
}
