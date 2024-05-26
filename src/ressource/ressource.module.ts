import { Module } from '@nestjs/common';
import { RessourceService } from './ressource.service';
import { RessourceController } from './ressource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RessourceEntity } from './entities/ressource.entity';
import { SessionTypeService } from 'src/session-type/session-type.service';
import { GroupService } from 'src/group/group.service';
import { SessionTypeEntity } from 'src/session-type/entities/session-type.entity';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherService } from 'src/user/teacher/teacher.service';
import { GroupEntity } from 'src/group/entities/group.entity';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { Teacher } from 'src/user/entities/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RessourceEntity,
      SessionTypeEntity,
      GroupEntity,
      SubjectEntity,
      Teacher,
    ]),
  ],
  controllers: [RessourceController],
  providers: [
    RessourceService,
    SessionTypeService,
    GroupService,
    SubjectService,
    TeacherService,
  ],
})
export class RessourceModule {}
