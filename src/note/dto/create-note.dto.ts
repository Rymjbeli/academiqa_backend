import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Student } from '../../user/entities/student.entity';
import { SessionEntity } from '../../session/entities/session.entity';
export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  /*  @IsNotEmpty()
  @Type(() => Student)
  student: Student;*/

  /*  @IsNotEmpty()
  @Type(() => SessionEntity)
  session: SessionEntity;*/
}
