import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { StudentEntity } from '../../user/entities/student.entity';
import { SessionEntity } from '../../session/entities/session.entity';
export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  /*  @IsNotEmpty()
  @Type(() => StudentEntity)
  student: StudentEntity;*/

  /*  @IsNotEmpty()
  @Type(() => SessionEntity)
  session: SessionEntity;*/
}
