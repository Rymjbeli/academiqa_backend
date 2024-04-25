import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Teacher } from '../user/entities/teacher.entity';
import { GetTaskDto } from './dto/get-task.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}
  async create(
    createTaskDto: CreateTaskDto,
    teacher: Teacher,
  ): Promise<TaskEntity> {
    const newTask = this.taskRepository.create(createTaskDto);
    newTask.teacher = teacher;
    return await this.taskRepository.save(newTask);
  }

  async findAll(teacher: Teacher): Promise<GetTaskDto[] | null> {
    const taskEntities = await this.taskRepository.find({
      where: {
        teacher: { id: teacher.id },
      },
    });
    if (!taskEntities) {
      throw new NotFoundException('No tasks found');
    }
    return taskEntities.map((task) => {
      return plainToClass(GetTaskDto, task);
    });
  }

  async findOne(id: number): Promise<GetTaskDto | null> {
    const taskEntity = await this.taskRepository.findOne({ where: { id } });
    if (!taskEntity) {
      throw new Error('Task not found');
    }
    return plainToClass(GetTaskDto, taskEntity);
  }

  // async findBySession(sessionId: number): Promise<TaskEntity[] | null> {
  //   const tasks = await this.findAll();
  //   return tasks.filter((task) => task.session.id == sessionId);
  // }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    teacher: Teacher,
  ): Promise<TaskEntity | null> {
    let task = await this.findOne(id);
    if (!task) {
      throw new Error('Task not found');
    }
    task = { ...task, ...updateTaskDto };
    if(task.teacher.id !== teacher.id){
      throw new Error('Unauthorized');
    } else {
      return await this.taskRepository.save(task);
    }
  }

  async remove(id: number, teacher: Teacher): Promise<TaskEntity | null> {
    const task = await this.findOne(id);
    if (!task) {
      throw new Error('Task not found');
    }
    if(task.teacher.id !== teacher.id){
      throw new Error('Unauthorized');
    } else {
      return await this.taskRepository.softRemove(task);
    }
  }

  async recover(id: number, teacher: Teacher): Promise<TaskEntity | null> {
    const task = await this.taskRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!task) {
      throw new Error('Task not found');
    }
    if(task.teacher.id !== teacher.id){
      throw new Error('Unauthorized');
    } else {
      return await this.taskRepository.recover(task);
    }
  }
}
