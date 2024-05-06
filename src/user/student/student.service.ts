import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAllStudents() {
    return await this.studentRepository.find({
      relations: ['group'],
      select: ['id', 'enrollmentNumber', 'cin', 'email', 'username', 'group'],
    });
  }

  async countStudents() {
    return await this.studentRepository.count();
  }

  async findOneStudent(id: number) {
    const [student] = await this.studentRepository.find({
      relations: ['group'],
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return {
      id: student.id,
      enrollmentNumber: student.enrollmentNumber,
      cin: student.cin,
      email: student.email,
      username: student.username,
      group: student.group,
      photo: student.photo,
      role: student.role,
    };
  }

  async updateStudent(id: number, data: Partial<Student>) {
    const student = await this.findOneStudent(id);
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    try {
      await this.studentRepository.update(id, data);
    } catch (e) {
      throw new ConflictException(
        `Email ${data.email} or cin ${data.cin} already exists`,
      );
    }
    return await this.findOneStudent(id);
  }

  async findAllStudentsBySectorLevel(sectorLevel: string) {
    return await this.studentRepository.find({
      relations: ['group'],
      where: { group: { sectorLevel: sectorLevel } },
    });
  }
}
