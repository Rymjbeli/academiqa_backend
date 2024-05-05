import { IsNotEmpty } from 'class-validator';

export class AddHolidaysDto {
  @IsNotEmpty()
  semesterStartDate: string;

  @IsNotEmpty()
  numberOfWeeks: number;
}
