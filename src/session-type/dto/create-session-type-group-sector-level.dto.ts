import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GroupEntity } from '../../group/entities/group.entity';
import { Type } from 'class-transformer';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { SessionTypeEnum } from '../../Enums/session-type.enum';

export class CreateSessionTypeGroupSectorLevelDto {
  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  startHour: string;

  @IsNotEmpty()
  endHour: string;

  @IsNotEmpty()
  @IsEnum(SessionTypeEnum)
  type: SessionTypeEnum;

  @IsNotEmpty()
  @IsString()
  sectorLevel: string;

  @IsNotEmpty()
  @IsNumber()
  groupNumber: number;

  @IsNotEmpty()
  @IsString()
  subjectName: string;

  /*  @IsNotEmpty()
  @IsNumber()
  teacherID: number;*/
}
