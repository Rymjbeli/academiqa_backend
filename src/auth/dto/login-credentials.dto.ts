import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class LoginCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {message: 'Password is too short'})
  cin: number;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
