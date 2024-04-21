import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Teacher } from '../user/entities/teacher.entity';
import { Student } from '../user/entities/student.entity';
import { Admin } from '../user/entities/admin.entity';
import { UserService } from '../user/user.service';
import {JwtService} from "@nestjs/jwt";
import {CreateTeacherDto} from "../user/dto/create-teacher.dto";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    userData: CreateUserDto,
    userRepository: Repository<User>,
  ): Promise<Partial<User>> {
    const user = userRepository.create({
      ...userData,
    });
    user.role = userRepository.metadata.targetName;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await userRepository.save(user);
    } catch (e) {
      throw new ConflictException('Email must be unique');
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
  async registerAdmin(userData: CreateUserDto): Promise<Partial<User>> {
    return this.createUser(userData, this.adminRepository);
  }

  async registerStudent(userData: CreateUserDto): Promise<Partial<User>> {
    return this.createUser(userData, this.studentRepository);
  }
  
    async registerTeacher(teacherData: CreateTeacherDto): Promise<Partial<User>> {
        return this.createUser(teacherData, this.teacherRepository);
    }

  async registerStudents(userData: CreateUserDto[]): Promise<Partial<User>[]> {
    const students = userData.map((data) =>
      this.registerStudent(data)
    );
    return Promise.all(students);
  }

  registerTeachers(teacherData: CreateTeacherDto[]): Promise<Partial<User>[]> {
    const teachers = teacherData.map((data) =>
      this.registerTeacher(data)
    );
    return Promise.all(teachers);
  }

  async login(credentials: LoginCredentialsDto)  {
    const { email, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new NotFoundException('User or password incorrect');
    }
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (user.password !== hashedPassword) {
      throw new NotFoundException('Password incorrect');
    }
    const payload = { email: user.email, role: user.role };
    const jwt = await this.jwtService.sign(payload);
    return {
      accessToken: jwt
    };
  }
}
