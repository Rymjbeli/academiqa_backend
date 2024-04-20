import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementEntity } from './entities/announcement.entity';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([AnnouncementEntity]), 
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService,SubjectService,UserService],
})
export class AnnouncementModule {}
