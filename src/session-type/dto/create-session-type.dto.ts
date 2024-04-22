import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GroupEntity } from '../../group/entities/group.entity';
import { Type } from 'class-transformer';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { SessionTypeEnum } from '../../Enums/session-type.enum';
import { TeacherEntity } from '../../user/entities/teacher.entity';

export class CreateSessionTypeDto {
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
  @Type(() => GroupEntity)
  group: GroupEntity;

  @IsNotEmpty()
  @Type(() => SubjectEntity)
  subject: SubjectEntity;

  /*  @IsNotEmpty()
  @Type(() => TeacherEntity)
  teacher: TeacherEntity;*/
}
