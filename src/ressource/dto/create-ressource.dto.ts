import {IsNotEmpty, IsOptional} from "class-validator";
import { SessionEntity } from "src/session/entities/session.entity";

export class CreateRessourceDto {
  @IsNotEmpty()
  session: number;

  type: string;
  @IsOptional()
  link: string;
  @IsOptional()
  fileUrl: string;
}
