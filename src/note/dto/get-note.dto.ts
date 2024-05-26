import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Student } from '../../user/entities/student.entity';
import { SessionEntity } from '../../session/entities/session.entity';

export class GetNoteDto {
  /*  @IsOptional()
  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsNumber()
  sessionId: number;*/
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  date: string;

  student: Student;

  session: SessionEntity;
}
