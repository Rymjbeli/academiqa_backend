import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';
import { Exclude, Expose } from 'class-transformer';
import { SessionTypeEnum } from '../../Enums/session-type.enum';

@Exclude()
export class GetSessionDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsNotEmpty()
  StartTime: Date;

  @Expose()
  @IsNotEmpty()
  EndTime: Date;

  @Expose()
  holidayName?: string[];

  @Expose()
  @IsString()
  name?: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(SessionTypeEnum)
  type: SessionTypeEnum;
}
