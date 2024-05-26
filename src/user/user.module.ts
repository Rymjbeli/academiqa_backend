import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';
import { Admin } from './entities/admin.entity';
import { GroupService } from '../group/group.service';
import { GroupEntity } from '../group/entities/group.entity';
import { TeacherController } from './teacher/teacher.controller';
import { StudentController } from './student/student.controller';
import { TeacherService } from './teacher/teacher.service';
import { StudentService } from './student/student.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { SessionTypeService } from '../session-type/session-type.service';
import { SessionTypeModule } from '../session-type/session-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Teacher, Student, Admin, GroupEntity]),
    SessionTypeModule,
  ],
  controllers: [
    UserController,
    TeacherController,
    StudentController,
    AdminController,
  ],
  providers: [
    UserService,
    GroupService,
    TeacherService,
    StudentService,
    AdminService,
  ],
  exports: [StudentService],
})
export class UserModule {}
