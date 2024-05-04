import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { Teacher } from "../../user/entities/teacher.entity";
import { SessionEntity } from '../../session/entities/session.entity';
@Exclude()
export class GetTaskDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsBoolean()
  isDone: boolean;

  @Expose()
  teacher: Teacher;

  @Expose()
  session: SessionEntity;
}
