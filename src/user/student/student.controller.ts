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
import { StudentService } from './student.service';
import { Student } from '../entities/student.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  async findAllStudents() {
    return await this.studentService.findAllStudents();
  }

  @Get('count')
  // @UseGuards(JwtAuthGuard)
  async countStudents() {
    return await this.studentService.countStudents();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneStudent(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.findOneStudent(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Student>,
  ) {
    return await this.studentService.updateStudent(id, data);
  }
}
