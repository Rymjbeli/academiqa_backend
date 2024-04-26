import { Module } from '@nestjs/common';
import { SessionTypeService } from './session-type.service';
import { SessionTypeController } from './session-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionTypeEntity } from './entities/session-type.entity';
import { GroupEntity } from '../group/entities/group.entity';
import { GroupService } from '../group/group.service';
import { SubjectEntity } from '../subject/entities/subject.entity';
import { SubjectService } from '../subject/subject.service';
import { Teacher } from '../user/entities/teacher.entity';
import { TeacherService } from '../user/teacher/teacher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionTypeEntity,
      GroupEntity,
      SubjectEntity,
      Teacher,
    ]),
  ],
  controllers: [SessionTypeController],
  providers: [SessionTypeService, GroupService, SubjectService, TeacherService],
})
export class SessionTypeModule {}
