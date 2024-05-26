import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { Teacher } from '../../user/entities/teacher.entity';
import { SessionEntity } from '../../session/entities/session.entity';
export class GetTaskDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;

  @IsBoolean()
  isDone: boolean;

  teacher: Teacher;

  session: SessionEntity;
}
