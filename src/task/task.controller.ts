import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { GetTaskDto } from './dto/get-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    // , @User() teacher: Teacher
  ): Promise<TaskEntity | null> {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<GetTaskDto[] | null> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetTaskDto | null> {
    return await this.taskService.findOne(id);
  }

  // @Get(':sessionId')
  // async getTasksBySession(
  //   @Param('sessionId', ParseIntPipe) sessionId: number,
  // ): Promise<TaskEntity[] | null> {
  //   return await this.taskService.findBySession(sessionId);
  // }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity | null> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity | null> {
    return this.taskService.remove(id);
  }

  @Get('recover/:id')
  async recover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskEntity | null> {
    return this.taskService.recover(id);
  }
}
