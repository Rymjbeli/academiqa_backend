import { Injectable } from '@nestjs/common';
import { CreateSessionTypeDto } from './dto/create-session-type.dto';
import { UpdateSessionTypeDto } from './dto/update-session-type.dto';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionTypeEntity } from './entities/session-type.entity';
import { CreateSessionTypeGroupSectorLevelDto } from './dto/create-session-type-group-sector-level.dto';
import { GroupService } from '../group/group.service';
import { SessionTypeEnum } from '../Enums/session-type.enum';
import { SubjectService } from '../subject/subject.service';
import { TeacherService } from '../user/teacher/teacher.service';

@Injectable()
export class SessionTypeService {
  constructor(
    @InjectRepository(SessionTypeEntity)
    private sessionTypeRepository: Repository<SessionTypeEntity>,
    private readonly fileUploadService: FileUploadService,
    private groupService: GroupService,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
  ) {}
  async createOneSessionType(
    createSessionTypeGroupSectorLevelDto: CreateSessionTypeGroupSectorLevelDto,
  ) {
    const consideredGroup = await this.groupService.findBySectorLevelGroup(
      createSessionTypeGroupSectorLevelDto.sectorLevel,
      createSessionTypeGroupSectorLevelDto.groupNumber,
    );
    const consideredSubject = await this.subjectService.findBySubjectName(
      createSessionTypeGroupSectorLevelDto.subjectName,
      createSessionTypeGroupSectorLevelDto.sectorLevel,
    );
    const consideredTeacher = await this.teacherService.findOneTeacher(
      createSessionTypeGroupSectorLevelDto.teacherID,
    );
    const createSessionTypeDto: CreateSessionTypeDto = {
      day: createSessionTypeGroupSectorLevelDto.day,
      startHour: createSessionTypeGroupSectorLevelDto.startHour,
      endHour: createSessionTypeGroupSectorLevelDto.endHour,
      type: createSessionTypeGroupSectorLevelDto.type,
      group: consideredGroup,
      subject: consideredSubject,
      teacher: consideredTeacher,
    };
    const sessionType =
      await this.sessionTypeRepository.create(createSessionTypeDto);
    return await this.sessionTypeRepository.save(sessionType);
  }

  async createSessionTypes(sessionTypeFile: Express.Multer.File) {
    const sessionTypes: CreateSessionTypeGroupSectorLevelDto[] =
      await this.fileUploadService.uploadCSVFile(sessionTypeFile);
    const sessionTypeEntities = sessionTypes.map(
      (createSessionTypeGroupSectorLevelDto) =>
        this.createOneSessionType(createSessionTypeGroupSectorLevelDto),
    );
    return Promise.all(sessionTypeEntities);
  }

  async findAll() {
    return await this.sessionTypeRepository
      .find({
        relations: ['teacher'],
      })
      .then((sessionTypes) => {
        return sessionTypes.map((sessionType) => {
          return {
            ...sessionType,
            teacher: {
              id: sessionType.teacher.id,
              email: sessionType.teacher.email,
              username: sessionType.teacher.username,
              speciality: sessionType.teacher.speciality,
              cin: sessionType.teacher.cin,
            },
          };
        });
      });
  }

  async findOne(id: number) {
    const sessionType = await this.sessionTypeRepository.findOne({
      relations: ['teacher'],
      where: { id },
    });
    if (!sessionType) {
      throw new Error('SessionType not found');
    }
    return {
      ...sessionType,
      teacher: {
        id: sessionType.teacher.id,
        email: sessionType.teacher.email,
        username: sessionType.teacher.username,
        speciality: sessionType.teacher.speciality,
        cin: sessionType.teacher.cin,
      },
    };
  }

  async findByType(type: SessionTypeEnum) {
    return await this.sessionTypeRepository
      .find({
        where: { type },
        relations: ['teacher'],
      })
      .then((sessionTypes) => {
        return sessionTypes.map((sessionType) => {
          return {
            ...sessionType,
            teacher: {
              id: sessionType.teacher.id,
              email: sessionType.teacher.email,
              username: sessionType.teacher.username,
              speciality: sessionType.teacher.speciality,
            },
          };
        });
      });
  }

  async findByGroupSectorLevel(sectorLevel: string, groupNumber: number) {
    /*    const consideredGroup = await this.groupService.findBySectorLevelGroup(
      sectorLevel,
      groupNumber,
    );*/
    return await this.sessionTypeRepository
      .find({
        relations: {
          teacher: true,
        },
        where: {
          group: {
            sectorLevel: sectorLevel,
            group: groupNumber,
          },
        },
      })
      .then((sessionTypes) => {
        return sessionTypes.map((sessionType) => {
          return {
            ...sessionType,
            teacher: {
              id: sessionType.teacher.id,
              email: sessionType.teacher.email,
              username: sessionType.teacher.username,
              speciality: sessionType.teacher.speciality,
              cin: sessionType.teacher.cin,
            },
          };
        });
      });
  }

  async findBySubjectSectorLevel(subjectName: string, sectorLevel: string) {
    /*    const consideredSubject = await this.subjectService.findBySubjectName(
      subjectName,
    );*/
    return await this.sessionTypeRepository
      .find({
        relations: {
          teacher: true,
        },
        where: {
          subject: {
            name: subjectName,
            sectorLevel: sectorLevel,
          },
        },
      })
      .then((sessionTypes) => {
        return sessionTypes.map((sessionType) => {
          return {
            ...sessionType,
            teacher: {
              id: sessionType.teacher.id,
              email: sessionType.teacher.email,
              username: sessionType.teacher.username,
              speciality: sessionType.teacher.speciality,
              cin: sessionType.teacher.cin,
            },
          };
        });
      });
  }

    async findByTeacher(teacherId: number): Promise<SessionTypeEntity[]> {
    return await this.sessionTypeRepository.find({
      relations: {
        teacher: true,
        group: true,
        subject: true,
      },
      where: {
        teacher: {
          id: teacherId,
        },
      },
    });
  }

  //////////getgroups by teacher
   async findGroupsByTeacher(teacherId: number) {
    const sessionTypes = await this.sessionTypeRepository.find({
      relations: ['group', 'teacher', 'subject'],
      where: {
        teacher: {
          id: teacherId,
        }}
      })
      .then((sessionTypes) => {
        return sessionTypes.map((sessionType) => {
          return {
            ...sessionType,
            teacher: {
              id: sessionType.teacher.id,
              email: sessionType.teacher.email,
              username: sessionType.teacher.username,
              speciality: sessionType.teacher.speciality,
              cin: sessionType.teacher.cin,
            },
          };
        });
      });
    const groups = sessionTypes.map((sessionType) => sessionType.group);

    const uniqueGroups = Array.from(
      new Set(groups.map((group) => group.id)),
    ).map((id) => {
      return groups.find((group) => group.id === id);
    });
    return uniqueGroups;
  }

  async update(id: number, updateSessionTypeDto: UpdateSessionTypeDto) {
    const sessionType = await this.findOne(id);
    if (!sessionType) {
      throw new Error('SessionType not found');
    } else {
      return await this.sessionTypeRepository.save({
        ...sessionType,
        ...updateSessionTypeDto,
      });
    }
  }

  async remove(id: number) {
    const sessionType = await this.findOne(id);
    if (!sessionType) {
      throw new Error('SessionType not found');
    } else {
      return await this.sessionTypeRepository.softRemove(sessionType);
    }
  }

  async recover(id: number) {
    const sessionType = await this.sessionTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!sessionType) {
      throw new Error('SessionType not found');
    } else {
      return await this.sessionTypeRepository.recover(sessionType);
    }
  }
}
