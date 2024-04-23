import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
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
}
