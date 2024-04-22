import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';

export class CreateTeacherDto extends CreateUserDto {

   @IsNotEmpty()
  speciality: string;

  // @IsNotEmpty()
  // photo: string;
}
