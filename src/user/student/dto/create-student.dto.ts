import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';
import { GroupEntity } from '../../../group/entities/group.entity';

export class CreateStudentDto extends CreateUserDto {
  // @IsNotEmpty()
  // photo: string;

  @IsNotEmpty()
  enrollmentNumber: number;

  @IsNotEmpty()
  group: GroupEntity;
}
