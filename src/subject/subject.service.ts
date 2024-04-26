import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { SubjectEntity } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
  ) {}
  async createOneSubject(createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectRepository.create(createSubjectDto);
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
    return await this.subjectRepository.findOneBy({ id });
  }

  async findBySubjectName(name: string) {
    const foundSubject = await this.subjectRepository.findOne({
      where: { name },
    });
    if (!foundSubject) {
      throw new Error('Subject not found' + name);
    }
    return foundSubject;
  }

  async findBySectorLevel(sectorLevel: string) {
    const subjects = await this.subjectRepository.find({
      where: { sectorLevel },
      relations: ["sessionTypes"],
    });

    return subjects.map((subject) => ({
      ...subject,
      teachersUsernames: subject.sessionTypes.map((sessionType) => sessionType.teacher.username),
    }));
    // return await this.subjectRepository.findBy({ sectorLevel });
  }

  // async findByTeacher() {
  //
  // }
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
}
