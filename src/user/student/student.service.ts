import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { SessionTypeService } from '../../session-type/session-type.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly SessionTypeService: SessionTypeService,
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

  async getStudentsByTeacherId(teacherId: number) {
    // Get unique groups associated with the teacher
    const uniqueGroups =
      await this.SessionTypeService.getUniqueGroupsByTeacherId(teacherId);

    // For each group, find all students that belong to the group
    const result = await Promise.all(
      uniqueGroups.map(async (group) => {
        const students = await this.studentRepository.find({
          select: ['username', 'photo'],
          where: { group: { id: group.id } },
        });

        // Extract student usernames and photos
        const studentData = students.map((student) => ({
          username: student.username,
          photo: student.photo,
        }));

        return {
          group: {
            group: group.group,
            sectorLevel: group.sectorLevel,
          },
          students: studentData,
        };
      }),
    );

    return await Promise.all(
      uniqueGroups.map(async (group) => {
        const students = await this.studentRepository.find({
          select: ['username', 'photo'],
          where: { group: { id: group.id } },
        });

        // Extract student usernames and photos
        const studentData = students.map((student) => ({
          username: student.username,
          photo: student.photo,
        }));

        const groupData = {
            group: group.group,
            sectorLevel: group.sectorLevel,
            };

        return {
          group: groupData.group,
            sectorLevel: groupData.sectorLevel,
          students: studentData,
        };
      }),
    );
  }
}
