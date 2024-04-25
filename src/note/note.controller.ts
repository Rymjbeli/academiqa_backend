import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query, UseGuards
} from "@nestjs/common";
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetNoteDto } from './dto/get-note.dto';
import { NoteEntity } from './entities/note.entity';
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../decorators/user.decorator";
import { Student } from "../user/entities/student.entity";

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: Student,
  ): Promise<NoteEntity | null> {
    return this.noteService.create(createNoteDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: Student): Promise<GetNoteDto[] | null> {
    return await this.noteService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Student,
  ): Promise<GetNoteDto | null> {
    return await this.noteService.findOne(id, user);
  }

  // @Get(':studentId/:sessionId')
  // async getNotesByStudentBySession(
  //   @Query() queryParams: GetNoteDto,
  // ): Promise<NoteEntity[] | null> {
  //   return await this.noteService.findAllByStudentBySession(queryParams);
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: Student,
  ): Promise<NoteEntity | null> {
    return await this.noteService.update(id, updateNoteDto,user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Student,
  ): Promise<NoteEntity | null> {
    return await this.noteService.remove(id, user);
  }

  @Get('recover/:id')
  @UseGuards(JwtAuthGuard)
  async recover(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Student,
  ): Promise<NoteEntity | null> {
    return await this.noteService.recover(id, user);
  }
}
