import { IsNotEmpty, IsNumber } from 'class-validator';
import { SessionEntity } from "../../session/entities/session.entity";
import { Student } from "../../user/entities/student.entity";

export class CreateAbsenceDto {
  @IsNumber()
  @IsNotEmpty()
  session: SessionEntity;
  @IsNumber()
  @IsNotEmpty()
  student: Student;
}
