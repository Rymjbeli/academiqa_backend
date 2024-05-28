import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetGroupDto {
  @IsString()
  sector: string;

  @IsString()
  level: string;

  @IsNumber()
  @Type(() => Number)
  group: number;
}
