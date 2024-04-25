import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { Student } from "../../user/entities/student.entity";

@Exclude()
export class GetNoteDto {
  /*  @IsOptional()
  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsNumber()
  sessionId: number;*/
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  content: string;

  date: string;

  @Expose()
  student: Student;

}
