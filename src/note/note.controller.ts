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

  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    // , @User() student: student
  ): Promise<NoteEntity | null> {
    return this.noteService.create(createNoteDto);
  }

  @Get()
  async findAll(): Promise<GetNoteDto[] | null> {
    return await this.noteService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetNoteDto | null> {
    return await this.noteService.findOne(id);
  }

  /*  @Get(':studentId')
  async getNotesByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
  ): Promise<NoteEntity[] | null> {
    return await this.noteService.findByStudent(studentId);
  }

  @Get(':studentId/:sessionId')
  async getNotesByStudentBySession(
    @Query() queryParams: GetNoteDto,
  ): Promise<NoteEntity[] | null> {
    return await this.noteService.findAllByStudentBySession(queryParams);
  }*/

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<NoteEntity | null> {
    return await this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NoteEntity | null> {
    return await this.noteService.remove(id);
  }

  @Get('recover/:id')
  async recover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NoteEntity | null> {
    return await this.noteService.recover(id);
  }
}
