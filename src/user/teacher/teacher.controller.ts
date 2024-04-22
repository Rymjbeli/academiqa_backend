import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { TeacherService } from './teacher.service';
import { Teacher } from '../entities/Teacher.entity';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  async findAllTeachers() {
    return await this.teacherService.findAllTeachers();
  }

  @Get('count')
  // @UseGuards(JwtAuthGuard)
  async countTeachers() {
    return await this.teacherService.countTeachers();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOneTeacher(@Param('id', ParseIntPipe) id: number) {
    return await this.teacherService.findOneTeacher(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Teacher>,
  ) {
    return await this.teacherService.updateTeacher(id, data);
  }
}
