import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTeacherDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    speciality: string;

    @IsNotEmpty()
    photo: string;
}
