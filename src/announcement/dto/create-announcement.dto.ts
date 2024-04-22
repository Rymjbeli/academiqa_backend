import { IsNotEmpty } from "class-validator";
import { SubjectEntity } from "src/subject/entities/subject.entity";
import { Teacher } from "src/user/entities/teacher.entity";

export class CreateAnnouncementDto {
    @IsNotEmpty()
    content : string;

    @IsNotEmpty()
    subject: SubjectEntity;

    @IsNotEmpty()
    teacher: Teacher;
    

}
