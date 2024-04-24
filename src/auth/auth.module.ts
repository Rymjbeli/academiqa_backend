import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Teacher } from '../user/entities/teacher.entity';
import { Student } from '../user/entities/student.entity';
import { Admin } from '../user/entities/admin.entity';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { GroupService } from '../group/group.service';
import { GroupEntity } from '../group/entities/group.entity';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Teacher, Admin, GroupEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [AuthService, UserService, JwtStrategy, GroupService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
