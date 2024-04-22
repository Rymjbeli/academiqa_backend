import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async findAllTeachers() {
    return await this.teacherRepository.find({

      select: ['id', 'email', 'username','cin', 'speciality'],
    });
  }

  async countTeachers(): Promise<number>{
    return await this.teacherRepository.count();
  }

  async findOneTeacher(id: number) {
    const teacher = await this.teacherRepository.findOneBy({ id });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return {
      id: teacher.id,
      email: teacher.email,
      username: teacher.username,
      speciality: teacher.speciality,
      cin: teacher.cin,
    };
  }

  async updateTeacher(id: number, data: Partial<Teacher>) {
    const teacher = await this.findOneTeacher(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    await this.teacherRepository.update(id, data);
    return await this.findOneTeacher(id);
  }
}
