import { IsNotEmpty, IsNumber } from 'class-validator';
import { SessionEntity } from '../../session/entities/session.entity';
import { Student } from '../../user/entities/student.entity';

export class CreatePresenceDto {
  @IsNotEmpty()
  session: SessionEntity;
  @IsNotEmpty()
  student: Student;
}
