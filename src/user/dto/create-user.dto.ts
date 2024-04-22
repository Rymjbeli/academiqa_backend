import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  cin: number;

  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;
}
