import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnouncementEntity } from './entities/announcement.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { SubjectService } from 'src/subject/subject.service';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private announcementRepository: Repository<AnnouncementEntity>,
    private teacherService: UserService,
    private subjectService: SubjectService,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    // create a new announcement
    const newAnnouncement = this.announcementRepository.create(
      createAnnouncementDto,
    );
    // newAnnouncement.teacher = await this.teacherService.findOne(createAnnouncementDto.teacherId);
    // newAnnouncement.subject = this.subjectService.findOne(createAnnouncementDto.subjectId);
    return await this.announcementRepository.save(newAnnouncement);
  }

  async findAll() {
    return await this.announcementRepository.find({
      relations: ['subject', 'teacher'],
    });
  }

  async findOne(id: number) {
    return await this.announcementRepository.findOne({
      where: { id },
      relations: ['subject', 'teacher'],
    });
  }

  async findBySubjectAndTeacher(subjectId: number, teacherId: number) {
    return await this.announcementRepository.find({
      relations: ['subject', 'teacher'],
      where: { subject: { id: subjectId }, teacher: { id: teacherId } },
    });
  }

  async findBySubject(subjectId: number) {
    return await this.announcementRepository.find({
      relations: ['subject', 'teacher'],
      where: { subject: { id: subjectId } },
    });
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    console.log(updateAnnouncementDto);
    // const updatedAnnouncement = this.announcementRepository.create(updateAnnouncementDto);
    // console.log(updatedAnnouncement);
    // return this.announcementRepository.save({id, ...updatedAnnouncement});
    return await this.announcementRepository.update(id, updateAnnouncementDto);
  }

  async softRemove(id: number) {
    return await this.announcementRepository.softRemove({ id });
  }

  async recover(id: number) {
    return await this.announcementRepository.restore(id);
  }
}
