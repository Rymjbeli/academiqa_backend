import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Teacher } from '../user/entities/teacher.entity';
import { GetTaskDto } from './dto/get-task.dto';
import { plainToClass } from 'class-transformer';
import { SessionEntity } from '../session/entities/session.entity';
import { User } from '../user/entities/user.entity';
import { UserRoleEnum } from '../Enums/user-role.enum';
import { NotifTypeEnum } from "../Enums/notif-type.enum";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NewNotificationService } from "../new-notification/new-notification.service";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private notificationService: NewNotificationService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(
    createTaskDto: CreateTaskDto,
    teacher: Teacher,
  ): Promise<TaskEntity> {
    if (teacher.role !== UserRoleEnum.TEACHER) {
      throw new UnauthorizedException('Unauthorized');
    }
    //console.log('createTaskDto', createTaskDto);
    const notification = await this.notificationService.buildNotification(
      NotifTypeEnum.CONTENT,
      teacher?.username,
      null,
      createTaskDto?.session?.id,
      0,
      teacher?.photo,
      teacher?.id,
    );

    this.eventEmitter.emit('notify', notification);
    const newTask = this.taskRepository.create(createTaskDto);
    newTask.teacher = teacher;
    //console.log('newTask', newTask);
    return await this.taskRepository.save(newTask);
  }

  async findAllBySession(
    sessionId: number,
    user: User,
  ): Promise<GetTaskDto[] | null> {
    const taskEntities = await this.taskRepository.find({
      where: {
        session: { id: sessionId },
      },
      // relations: ['session', 'teacher'],
    });
    if (!taskEntities) {
      throw new NotFoundException('No tasks found');
    }
    return taskEntities.map((task) => {
      return plainToClass(GetTaskDto, task);
    });
  }

  async findTasksOfTeacher(teacher: Teacher): Promise<GetTaskDto[] | null> {
    const taskEntities = await this.taskRepository.find({
      where: {
        teacher: { id: teacher.id },
      },
      relations: ['session', 'teacher'],
    });
    if (!taskEntities) {
      //console.log('tasks', taskEntities);
      throw new NotFoundException('No tasks found');
    }
    //console.log('tasks', taskEntities);
    return taskEntities.map((task) => {
      return plainToClass(GetTaskDto, task);
    });
  }

  async findOne(id: number, teacherId: number): Promise<GetTaskDto | null> {
    const taskEntity = await this.taskRepository.findOne({
      where: {
        id,
        teacher: { id: teacherId },
      },
      relations: ['session', 'teacher'],
    });
    if (!taskEntity) {
      throw new NotFoundException('Task not found');
    }
    return plainToClass(GetTaskDto, taskEntity);
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    teacher: Teacher,
  ): Promise<TaskEntity | null> {
    if (teacher.role !== UserRoleEnum.TEACHER) {
      throw new UnauthorizedException('Unauthorized');
    }
    let task = await this.findOne(id, teacher.id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    task = { ...task, ...updateTaskDto };
    if (task.teacher.id !== teacher.id) {
      throw new UnauthorizedException('Unauthorized');
    } else {
      return await this.taskRepository.save(task);
    }
  }

  async remove(id: number, teacher: Teacher): Promise<TaskEntity | null> {
    if (teacher.role !== UserRoleEnum.TEACHER) {
      throw new UnauthorizedException('Unauthorized');
    }
    const task = await this.findOne(id, teacher.id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.teacher.id !== teacher.id) {
      throw new UnauthorizedException('Unauthorized');
    } else {
      return await this.taskRepository.softRemove(task);
    }
  }

  async recover(id: number, teacher: Teacher): Promise<TaskEntity | null> {
    if (teacher.role !== UserRoleEnum.TEACHER) {
      throw new UnauthorizedException('Unauthorized');
    }
    const task = await this.taskRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.teacher.id !== teacher.id) {
      throw new UnauthorizedException('Unauthorized');
    } else {
      return await this.taskRepository.recover(task);
    }
  }
}
