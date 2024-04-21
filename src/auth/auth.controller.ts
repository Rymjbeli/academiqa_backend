import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import {JwtAuthGuard} from "./guard/jwt-auth.guard";
import { CurrentUser } from 'src/decorators/user.decorator';
import {CreateTeacherDto} from "../user/dto/create-teacher.dto";
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<Partial<User>> {
    return await this.authService.registerAdmin(userData);
  }

  @Post('students')
  @UseGuards(JwtAuthGuard)
  async registerStudents(
      @CurrentUser() user: User,
    @Body() userData: CreateUserDto[],
  ): Promise<Partial<User>[]> {
    return await this.authService.registerStudents(userData);
  }

  @Post('teachers')
  @UseGuards(JwtAuthGuard)
  async registerTeachers(
    @Body() userData: CreateTeacherDto[],
  ): Promise<Partial<User>[]> {
    return await this.authService.registerTeachers(userData);
  }

  @Post('login')
  async login(@Body() credentials: LoginCredentialsDto) {
    return await this.authService.login(credentials);
  }
}
