import { IsNumber, IsOptional } from 'class-validator';

export class GetNoteDto {
  @IsOptional()
  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsNumber()
  sessionId: number;
}
