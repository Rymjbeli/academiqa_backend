import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { SubjectEntity } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionTypeEntity } from '../session-type/entities/session-type.entity';
import { Teacher } from '../user/entities/teacher.entity';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotifTypeEnum } from "../Enums/notif-type.enum";

@Injectable()
export class SubjectService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(SessionTypeEntity)
    private sessionTypeRepository: Repository<SessionTypeEntity>,
    private eventEmitter: EventEmitter2,
  ) {}
  async createOneSubject(createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectRepository.create(createSubjectDto);
    const payload = {
      notificationType: NotifTypeEnum.CONTENT,
      content:'ramroum',
      broadcast: null,
      link: null,
      receiver: 0
    }
    this.eventEmitter.emit('notify', payload);
    return await this.subjectRepository.save(subject);
  }
  async createSubjects(subjectFile: Express.Multer.File) {
    const subjects: CreateSubjectDto[] =
      await this.fileUploadService.uploadCSVFile(subjectFile);
    const subjectEntities = subjects.map((createSubjectDto) =>
      this.createOneSubject(createSubjectDto),
    );
    return Promise.all(subjectEntities);
  }

  async findAll() {
    return await this.subjectRepository.find();
  }
  async findAllGroupedByModule() {
    const subjects = await this.findAll();

    const groupedSubjects = subjects.reduce((grouped, subject) => {
      const key = subject.module;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(subject);
      return grouped;
    }, {});

    return Object.keys(groupedSubjects).map((module) => ({
      module,
      subjects: groupedSubjects[module],
    }));
  }

  async findOne(id: number) {
    const course = await this.subjectRepository.findOne({
      where: { id },
      relations: [
        'sessionTypes',
        'sessionTypes.teacher',
        'sessionTypes.sessions',
      ],
    });
    if (!course) {
      throw new Error('Subject not found');
    }

    return this.filterOneSubject(course);
  }

  async findBySubjectName(name: string, sectorLevel: string) {
    const foundSubject = await this.subjectRepository.findOne({
      where: { name: name, sectorLevel: sectorLevel },
    });
    if (!foundSubject) {
      throw new Error('Subject not found' + name);
    }
    return foundSubject;
  }

  async findBySectorLevel(sectorLevel: string) {
    const subjects = await this.subjectRepository.find({
      where: { sectorLevel },
      relations: [
        'sessionTypes',
        'sessionTypes.teacher',
        'sessionTypes.sessions',
      ],
    });

    return this.filterSubjects(subjects);
  }
  async findByTeacher(teacher: Teacher) {
    const subjects = await this.subjectRepository.find({
      where: {
        sessionTypes: {
          teacher: { id: teacher.id }, // Filter subjects by the provided teacher
        },
      },
      relations: [
        'sessionTypes',
        'sessionTypes.sessions',
        'sessionTypes.teacher',
      ],
    });

    return this.filterSubjects(subjects);
  }
  async deleteSubject(id: number) {
    const subject = await this.findOne(id);
    if (!subject) {
      throw new Error('Subject not found');
    } else {
      return await this.subjectRepository.softRemove(subject);
    }
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.findOne(id);
    console.log('subject', subject);
    if (!subject) {
      throw new Error('Subject not found');
    } else {
      return await this.subjectRepository.save({
        ...subject,
        ...updateSubjectDto,
      });
    }
  }

  filterSubjects(subjects: SubjectEntity[]) {
    return subjects.map((subject) => {
      const sessionTypes = subject.sessionTypes.map(
        ({ teacher, subject, ...sessionType }) => sessionType,
      );

      // Create a Set to remove duplicate usernames
      const teacherUsernamesSet = new Set(
        subject.sessionTypes.map(
          (sessionType) => sessionType?.teacher.username,
        ),
      );

      // Convert the Set back to an array
      const uniqueTeachersUsernames = Array.from(teacherUsernamesSet);

      return {
        ...subject,
        sessionTypes,
        teachersUsernames: uniqueTeachersUsernames,
      };
    });
  }

  filterOneSubject(course: SubjectEntity) {
    // Create a map to store teachers and their types
    const teacherMap = new Map();

    // Iterate through the session types to create a map of teachers and their types
    course.sessionTypes.forEach(({ teacher, type }) => {
      if (teacher && teacher.username) {
        // Check if teacher's username is already in the map
        if (!teacherMap.has(teacher.username)) {
          // Create a new entry with the teacher's ID and a new set for the types
          teacherMap.set(teacher.username, {
            id: teacher.id,
            types: new Set([type]),
          });
        } else {
          // Add the type to the existing set for the teacher's entry
          teacherMap.get(teacher.username).types.add(type);
        }
      }
    });

    // Convert the map to an array of objects, each containing a teacher's username, ID, and the types they teach
    const teachersAndTypes = Array.from(teacherMap.entries()).map(
      ([username, data]) => ({
        username,
        id: data.id,
        types: Array.from(data.types), // Convert the set of types to an array
      }),
    );

    return {
      ...course,
      sessionTypes: course.sessionTypes.map(
        ({ teacher, subject, ...sessionType }) => ({
          ...sessionType,
          // Include the teacher's ID in the session type
          teacherId: teacher?.id || null,
        }),
      ),
      // The `teachersUsernames` array now contains objects with the teacher's username, ID, and the types they teach
      teachersUsernames: teachersAndTypes,
    };
  }
}
