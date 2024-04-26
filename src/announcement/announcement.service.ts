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
    return this.announcementRepository.save(newAnnouncement);
  }

  findAll() {
    return this.announcementRepository.find({
      relations: ['subject', 'teacher'],
    });
  }

  findOne(id: number) {
    return this.announcementRepository.findOne({
      where: { id },
      relations: ['subject', 'teacher'],
    });
  }

  update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    console.log(updateAnnouncementDto);
    // const updatedAnnouncement = this.announcementRepository.create(updateAnnouncementDto);
    // console.log(updatedAnnouncement);
    // return this.announcementRepository.save({id, ...updatedAnnouncement});
    return this.announcementRepository.update(id, updateAnnouncementDto);
  }

  softRemove(id: number) {
    return this.announcementRepository.softRemove({ id });
  }

  recover(id: number) {
    return this.announcementRepository.restore(id);
  }
}
