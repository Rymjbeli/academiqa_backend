import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  sector: string;
  @IsNotEmpty()
  @IsString()
  level: string;
  @IsNotEmpty()
  @IsNumber()
  group: number;
  @IsNotEmpty()
  @IsString()
  sectorLevel: string;
}
