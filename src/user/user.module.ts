import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';
import { TeacherController } from './teacher/teacher.controller';
import { TeacherService } from './teacher/teacher.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { StudentEntity } from './entities/student.entity';
import { TeacherEntity } from './entities/teacher.entity';
import { AdminEntity } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      StudentEntity,
      TeacherEntity,
      AdminEntity,
    ]),
  ],
  controllers: [
    UserController,
    StudentController,
    TeacherController,
    AdminController,
  ],
  providers: [UserService, StudentService, TeacherService, AdminService],
})
export class UserModule {}
