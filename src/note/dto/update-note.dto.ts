import { IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

@Exclude()
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
