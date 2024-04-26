import {
  ConflictException, ForbiddenException,
  Injectable,
  NotFoundException, UnauthorizedException
} from "@nestjs/common";
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
import { JwtService } from '@nestjs/jwt';
import { CreateTeacherDto } from '../user/teacher/dto/create-teacher.dto';
import { CreateStudentDto } from '../user/student/dto/create-student.dto';
import { GroupService } from '../group/group.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { MailService } from '../mail/mail.service';

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
    private groupService: GroupService,
    private readonly fileUploadService: FileUploadService,
    private readonly mailService: MailService,
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
    // console.log("CreateUserDto",userData);
    try {
      await userRepository.save(user);
    } catch (e) {
      throw new ConflictException(
        `Email ${user.email} or cin ${user.cin} already exists`,
      );
    }

    // Send welcome email
    const receiver = user.email;
    const subject = 'Welcome to AcademIQa';
    const content = `<p>Dear ${user.username},</p>
    <p>Welcome to our platform AcademIQa. We are glad to have you with us. You can now log in to your account with the following credentials:</p>
    <p> <strong> Email: ${userData.email}</strong></p>
    <p> <strong> Password: ${userData.password}</strong></p>
    <p>Best regards,</p>`;
    await this.mailService.sendEmail(receiver, subject, content);

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

  async registerStudent(
    studentData: CreateStudentDto,
  ): Promise<Partial<Student>> {
    return this.createUser(studentData, this.studentRepository);
  }

  async registerStudents(
    studentsFile: Express.Multer.File,
  ): Promise<void> {
    const studentsData: any =
      await this.fileUploadService.uploadCSVFile(studentsFile);
    const conflictEmails: string[] = [];

    // Loop through each student data and attempt registration
    await Promise.all(
      studentsData.map(async (studentData: any) => {
        try {
          // Get group using sectorLevel and groupNumber
          const group = await this.groupService.findBySectorLevelGroup(
            studentData.sectorLevel,
            studentData.groupNumber,
          );
          console.log("group",group);
          if (!group) {
            // If group not found, add the email to conflicts array
            // conflictEmails.push(studentData.email);
            // return;
          }
          // Create CreateStudentDto using group and other student data
          const createStudentDto: CreateStudentDto = {
            ...studentData,
            group,
          };
          // Register student with createStudentDto
          await this.registerStudent(createStudentDto);
        } catch (e) {
          // If conflict occurs, add the email to conflicts array
          conflictEmails.push(studentData.email);
        }
      }),
    );
    if (conflictEmails.length > 0) {
      throw new ConflictException(conflictEmails);
    }
  }
  async registerTeacher(teacherData: CreateTeacherDto): Promise<Partial<User>> {
    return await this.createUser(teacherData, this.teacherRepository);
  }

  async registerTeachers(
    teacherDataFile: Express.Multer.File,
  ): Promise<void> {
    const teachersData: any =
      await this.fileUploadService.uploadCSVFile(teacherDataFile);

    const conflictEmails: string[] = [];

    // Loop through each teacher data and attempt registration
    await Promise.all(
      teachersData.map(async (data: CreateTeacherDto) => {
        try {
          const registeredTeacher = await this.registerTeacher(data);
        } catch (e) {
          // If conflict occurs, add the email to conflicts array
          conflictEmails.push(data.email);
        }
      }),
    );

    // return { conflicts: conflictEmails };
    if (conflictEmails.length > 0) {
      throw new ConflictException(conflictEmails);
    }
  }

  async login(credentials: LoginCredentialsDto) {
    const { email, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };
    const jwt = await this.jwtService.sign(payload);
    return {
      accessToken: jwt,
    };
  }
}