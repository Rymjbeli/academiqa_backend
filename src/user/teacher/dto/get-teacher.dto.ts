import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetTeacherDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  speciality: string;

  @IsNotEmpty()
  @IsNumber()
  cin: number;

  @IsString()
  photo: string;
}
