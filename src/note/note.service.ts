import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Repository } from 'typeorm';
import { NoteEntity } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetNoteDto } from './dto/get-note.dto';
import { StudentEntity } from '../user/entities/student.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
  ) {}
  async create(
    createNoteDto: CreateNoteDto,
    student: StudentEntity,
  ): Promise<NoteEntity> {
    const newNote = this.noteRepository.create(createNoteDto);
    newNote.student = student;
    return await this.noteRepository.save(newNote);
  }

  async findAll(): Promise<NoteEntity[] | null> {
    return await this.noteRepository.find();
  }

  async findOne(id: number): Promise<NoteEntity | null> {
    return await this.noteRepository.findOne({ where: { id } });
  }

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
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }

  /*  async createTestStudent(): Promise<StudentEntity> {
    try {
      const student = new StudentEntity();
      student.email = 'ryra@g.com';
      student.password = '123456';
      student.username = 'ines';
      student.role = 'STUDENT';
      student.speciality = 'GL';
      student.group = 2;
      student.level = '3';
      student.sectorLevel = `${student.speciality} ${student.level}`;
      student.photo = 'photo.jpg';
      student.enrollmentNumber = 123456;
      const savedStudent = await this.studentRepository.save(student);
      console.log('created');

      // Fetch the student immediately after saving
      const fetchedStudent = await this.studentRepository.findOne({
        where: { id: savedStudent.id },
      });
      console.log('Fetched student:', fetchedStudent);

      return savedStudent;
    } catch (error) {
      console.log('erreeuur');
      throw error;
    }
  }
  async getTestStudent(): Promise<StudentEntity[]> {
    const students = await this.studentRepository.find();
    console.log('Retrieved students:', students);
    return students;
  }*/
}
