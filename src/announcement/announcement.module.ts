import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementEntity } from './entities/announcement.entity';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import {User} from "../user/entities/user.entity";
import { SubjectModule } from "../subject/subject.module";

@Module({
  imports:[
    SubjectModule,
    TypeOrmModule.forFeature([AnnouncementEntity, User]),
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, UserService],
})
export class AnnouncementModule {}
