import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  sectorLevel: string;
  @IsNotEmpty()
  absenceLimit: number;
  @IsNotEmpty()
  coefficient: number;
  @IsString()
  @IsNotEmpty()
  module: string;
  @IsNotEmpty()
  hourlyLoad: number;
}
