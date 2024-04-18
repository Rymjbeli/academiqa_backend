import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetNoteDto } from './dto/get-note.dto';
import { NoteEntity } from './entities/note.entity';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  /*  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @User() student: StudentEntity) {
    return this.noteService.create(createNoteDto);
  }*/

  @Get()
  findAll(): Promise<NoteEntity[] | null> {
    return this.noteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.findOne(id);
  }

  @Get(':studentId')
  getNotesByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.noteService.findByStudent(studentId);
  }

  @Get(':studentId/:sessionId')
  getNotesByStudentBySession(@Query() queryParams: GetNoteDto) {
    return this.noteService.findAllByStudentBySession(queryParams);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteService.remove(+id);
  }
}
