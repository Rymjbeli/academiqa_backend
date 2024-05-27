import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetNoteDto } from './dto/get-note.dto';
import { Repository } from 'typeorm';
import { NoteEntity } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../user/entities/student.entity';
import { plainToClass } from 'class-transformer';
import { SessionEntity } from '../session/entities/session.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}
  async create(
    createNoteDto: CreateNoteDto,
    student: Student,
  ): Promise<NoteEntity> {
    const newNote = await this.noteRepository.create(createNoteDto);
    newNote.student = student;
    return await this.noteRepository.save(newNote);
  }

  async findAll(student: Student): Promise<GetNoteDto[] | null> {
    const noteEntities = await this.noteRepository.find({
      where: {
        student: { id: student.id },
      },
      relations: ['session'],
    });
    if (!noteEntities) {
      throw new NotFoundException('No notes found');
    }
    return noteEntities.map((note) => {
      const noteDto = plainToClass(GetNoteDto, note);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };
      noteDto.date = Intl.DateTimeFormat('en-US', options).format(
        note.createdAt,
      );
      return noteDto;
    });
  }

  async findAllBySession(
    student: Student,
    sessionId: number,
  ): Promise<GetNoteDto[] | null> {
    //console.log(student.id);
    const noteEntities = await this.noteRepository.find({
      where: {
        student: { id: student.id },
        session: { id: sessionId },
      },
      relations: ['session'],
    });
    if (!noteEntities) {
      throw new NotFoundException('No notes found');
    }
    return noteEntities.map((note) => {
      const noteDto = plainToClass(GetNoteDto, note);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };
      noteDto.date = Intl.DateTimeFormat('en-US', options).format(
        note.createdAt,
      );
      return noteDto;
    });
  }

  async findAllByStudentBySession(
    student: Student,
    sessionId: number,
  ): Promise<NoteEntity[] | null> {
    const notes = await this.noteRepository.find({
      relations: ['student', 'session'],
      where: { session: { id: sessionId } },
    });
    if (!notes) {
      throw new NotFoundException('No notes found');
    }
    const studentNotes = notes.filter((note) => note.student.id === student.id);
    if (studentNotes.length === 0) {
      return [];
    }
    return studentNotes;
  }
  async findOne(id: number, student: Student): Promise<GetNoteDto | null> {
    const noteEntity = await this.noteRepository.findOne({
      where: { id },
      relations: ['session', 'student'],
    });
    if (!noteEntity) {
      throw new NotFoundException('Note not found');
    }
    if (noteEntity.student.id != student.id) {
      throw new UnauthorizedException('Unauthorized');
    } else {
      const noteDto = plainToClass(GetNoteDto, noteEntity);

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };
      noteDto.date = Intl.DateTimeFormat('en-US', options).format(
        noteEntity.createdAt,
      );
      return noteDto;
    }
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    student: Student,
  ): Promise<NoteEntity | null> {
    let note = await this.noteRepository.findOne({
      where: { id },
      relations: ['student', 'session'],
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note = { ...note, ...updateNoteDto };
    if (note.student.id !== student.id) {
      throw new UnauthorizedException('Unauthorized');
    } else {
      return await this.noteRepository.save(note);
    }
  }

  async remove(id: number, student: Student): Promise<NoteEntity | null> {
    const note = await this.findOne(id, student);
    if (!note) {
      throw new Error('Note not found');
    }
    if (note.student.id !== student.id) {
      throw new UnauthorizedException('Unauthorized');
    } else {
      return await this.noteRepository.softRemove(note);
    }
  }

  async recover(id: number, user: Student): Promise<NoteEntity | null> {
    const note = await this.noteRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!note) {
      throw new Error('Note not found');
    }
    if (note.student && note.student.id !== user.id) {
      throw new UnauthorizedException('Unauthorized');
    } else {
      return await this.noteRepository.recover(note);
    }
  }
}
