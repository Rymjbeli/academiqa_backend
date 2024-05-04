import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GroupEntity } from '../../group/entities/group.entity';
import { Type } from 'class-transformer';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { SessionTypeEnum } from '../../Enums/session-type.enum';
import { Teacher } from '../../user/entities/teacher.entity';
import { GetTeacherDto } from '../../user/teacher/dto/get-teacher.dto';

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

  @IsNotEmpty()
  teacher: GetTeacherDto;
}
