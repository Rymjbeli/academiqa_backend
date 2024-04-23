import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionTypeService } from '../session-type/session-type.service';
import { SessionTypeEntity } from '../session-type/entities/session-type.entity';
import { GroupService } from '../group/group.service';
import { SubjectService } from '../subject/subject.service';
import { TeacherService } from '../user/teacher/teacher.service';
import { GroupEntity } from '../group/entities/group.entity';
import { SubjectEntity } from '../subject/entities/subject.entity';
import { TeacherEntity } from '../user/entities/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionEntity,
      SessionTypeEntity,
      GroupEntity,
      SubjectEntity,
      TeacherEntity,
    ]),
  ],
  controllers: [SessionController],
  providers: [
    SessionService,
    SessionTypeService,
    GroupService,
    SubjectService,
    TeacherService,
  ],
})
export class SessionModule {}
