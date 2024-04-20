import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetNoteDto } from './dto/get-note.dto';
import { Repository } from 'typeorm';
import { NoteEntity } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '../user/entities/student.entity';
import { Expose, plainToClass } from 'class-transformer';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}
  async create(
    createNoteDto: CreateNoteDto,
    // student: StudentEntity,
  ): Promise<NoteEntity> {
    const newNote = this.noteRepository.create(createNoteDto);
    // newNote.student = student;
    return await this.noteRepository.save(newNote);
  }

  async findAll(): Promise<GetNoteDto[] | null> {
    const noteEntities = await this.noteRepository.find();
    if (!noteEntities) {
      return null;
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

  async findOne(id: number): Promise<GetNoteDto | null> {
    const noteEntity = await this.noteRepository.findOne({ where: { id } });
    if (!noteEntity) {
      return null;
    }
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
  /*
  async findByStudent(studentId: number): Promise<NoteEntity[] | null> {
    const notes = await this.findAll();
    return notes.filter((note) => note.student.id == studentId);
  }

  async findAllByStudentBySession(
    queryParams: GetNoteDto,
  ): Promise<NoteEntity[] | null> {
    const { studentId, sessionId } = queryParams;
    const notes = await this.noteRepository.find();
    if (!studentId && !sessionId) {
      return notes;
    }
    return notes.filter((note) => {
      if (studentId && note.student.id != studentId) {
        return false;
      }
      return !(sessionId && note.session.id != sessionId);
    });
  }*/

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
  ): Promise<NoteEntity | null> {
    let note = await this.noteRepository.findOne({ where: { id } });
    if (!note) {
      return null;
    }
    note = { ...note, ...updateNoteDto };
    return await this.noteRepository.save(note);
  }

  async remove(id: number): Promise<NoteEntity | null> {
    const note = await this.findOne(id);
    if (!note) {
      return null;
    }
    return await this.noteRepository.softRemove(note);
  }

  async recover(id: number): Promise<NoteEntity | null> {
    const note = await this.noteRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!note) {
      return null;
    }
    return await this.noteRepository.recover(note);
  }
}
