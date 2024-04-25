import { IsNumber, IsString } from 'class-validator';

export class GetGroupDto {
  @IsString()
  sector: string;

  @IsString()
  level: string;

  @IsNumber()
  group: number;
}
