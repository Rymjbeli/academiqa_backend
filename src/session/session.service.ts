import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionTypeEntity } from '../session-type/entities/session-type.entity';
import { SessionEntity } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionTypeService } from '../session-type/session-type.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { NotFoundError } from 'rxjs';
import { GetSessionDto } from './dto/get-session.dto';
import { AddSessionDto } from './dto/add-session.dto';
import { GetGroupDto } from '../group/dto/get-group.dto';
import { GroupService } from '../group/group.service';
import { SessionTypeEnum } from '../Enums/session-type.enum';
import { Student } from '../user/entities/student.entity';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionTypeEntity)
    private sessionTypeRepository: Repository<SessionTypeEntity>,

    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private readonly fileUploadService: FileUploadService,

    private sessionTypeService: SessionTypeService,
    private groupService: GroupService,
  ) {}

  // let semesterStartDate = '2022-09-01';

  async uploadHolidaysFile(holidaysFile: Express.Multer.File) {
    return await this.fileUploadService.uploadCSVFile(holidaysFile);
  }

  generateSessionDates(
    numberOfWeeks: number,
    semesterStartDate: string,
    sessionTypeDay: string,
  ) {
    const dayMapping = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0,
    };
    const dates = [];
    for (let i = 0; i < numberOfWeeks; i++) {
      const date = new Date(semesterStartDate);
      date.setUTCDate(
        date.getUTCDate() +
          7 * i +
          (dayMapping[sessionTypeDay] - date.getUTCDay()),
      );
      date.setUTCHours(0);
      if (date >= new Date(semesterStartDate)) {
        dates.push(date);
      }
    }
    return dates;
  }

  checkHoliday(date: Date, holidays: { date: Date; name: string }[]) {
    holidays = holidays.map((holiday) => {
      return {
        ...holiday,
        date: new Date(holiday.date),
      };
    });
    return holidays
      .filter(
        (holiday) =>
          holiday.date.toISOString().split('T')[0] ===
          date.toISOString().split('T')[0],
      )
      .map((holiday) => holiday.name);
  }

  async createSession(createSessionDto: CreateSessionDto) {
    const session = new SessionEntity();
    session.name = createSessionDto.name;
    session.date = createSessionDto.date;
    session.endTime = createSessionDto.endTime;
    session.holidayName = createSessionDto.holidayName;
    session.sessionType = createSessionDto.sessionType;
    await this.sessionRepository.save(session);
    return session;
  }

  async generateSessionsForOneSessionType(
    sessionType: SessionTypeEntity,
    numberOfWeeks: number,
    semesterStartDate: string,
    holidaysFile: Express.Multer.File,
  ) {
    const holidays = await this.uploadHolidaysFile(holidaysFile);
    const dates = this.generateSessionDates(
      numberOfWeeks,
      semesterStartDate,
      sessionType.day,
    );
    const sessions = [];
    for (const date of dates) {
      const holidayNames = this.checkHoliday(date, holidays);
      if (holidayNames.length > 0) {
        let existingSession;
        try {
          existingSession = await this.findOneHoliday(date);
        } catch (e) {
          console.log(e);
        }
        if (existingSession) {
          existingSession.holidayName = holidayNames;
          await this.sessionRepository.save(existingSession);
          sessions.push(existingSession);
        } else {
          date.setUTCHours(date.getUTCHours() - 1);
          const endTime = new Date(date);
          endTime.setHours(23, 59, 59);
          const createSessionDto = new CreateSessionDto();
          createSessionDto.date = date;
          createSessionDto.endTime = endTime;
          createSessionDto.holidayName = holidayNames;
          // createSessionDto.sessionType = sessionType;
          const session = await this.createSession(createSessionDto);
          sessions.push(session);
        }
      } else {
        const [startHours, startMinutes] = sessionType.startHour
          .split(':')
          .map(Number);
        date.setHours(startHours);
        date.setMinutes(startMinutes);
        date.setSeconds(0);
        const [endHours, endMinutes] = sessionType.endHour
          .split(':')
          .map(Number);
        const endTime = new Date(date);
        endTime.setHours(endHours);
        endTime.setMinutes(endMinutes);
        const createSessionDto = new CreateSessionDto();
        createSessionDto.name = sessionType.subject.name;
        createSessionDto.date = date;
        createSessionDto.endTime = endTime;
        if (sessionType.type === SessionTypeEnum.Lecture) {
          const sessionTypeForTheSameSectorLevel =
            await this.sessionTypeRepository.find({
              where: {
                subject: {
                  name: sessionType.subject.name,
                },
                type: SessionTypeEnum.Lecture,
                group: {
                  sectorLevel: sessionType.group.sectorLevel,
                },
              },
            });
          if (sessionTypeForTheSameSectorLevel.length > 1) {
            if (sessionTypeForTheSameSectorLevel[0].id === sessionType.id) {
              createSessionDto.sessionType = sessionType;
              const session = await this.createSession(createSessionDto);
              sessions.push(session);
            }
          } else {
            createSessionDto.sessionType = sessionType;
            const session = await this.createSession(createSessionDto);
            sessions.push(session);
          }
        } else {
          createSessionDto.sessionType = sessionType;
          const session = await this.createSession(createSessionDto);
          sessions.push(session);
        }
      }
    }
    return sessions;
  }

  async generateSessionsForAllSessionTypes(
    numberOfWeeks: number,
    semesterStartDate: string,
    holidaysFile: Express.Multer.File,
  ) {
    const sessionTypes = await this.sessionTypeRepository.find();
    const sessions = await Promise.all(
      sessionTypes.map((sessionType) =>
        this.generateSessionsForOneSessionType(
          sessionType,
          numberOfWeeks,
          semesterStartDate,
          holidaysFile,
        ),
      ),
    );
    await this.deleteDuplicateHolidaySessions();
    return sessions.flat();
  }

  async deleteDuplicateHolidaySessions() {
    // Retrieve all sessions
    const sessions = await this.sessionRepository.find();

    // Group sessions by date and holiday name
    const groupedSessions = sessions.reduce((grouped, session) => {
      if (session.holidayName) {
        // Check if holidayName is not null
        session.holidayName.forEach((holidayName) => {
          const key = `${session.date.toISOString().split('T')[0]}_${holidayName}`;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(session);
        });
      }
      return grouped;
    }, {});

    // For each group of duplicate sessions, keep the first one and delete the rest
    for (const key in groupedSessions) {
      const duplicateSessions = groupedSessions[key];
      if (duplicateSessions.length > 1) {
        const sessionsToDelete = duplicateSessions.slice(1);
        // Since we are deleting by IDs, extract only the IDs
        const sessionIdsToDelete = sessionsToDelete.map(
          (session) => session.id,
        );
        await this.sessionRepository.delete(sessionIdsToDelete);
      }
    }
  }

  // this function is used to add a session
  async addSession(addSessionDto: AddSessionDto, getGroupDto: GetGroupDto) {
    let date = addSessionDto.date;
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const isHoliday = await this.findOneHoliday(date);
    if (isHoliday) {
      throw {
        type: 'HolidayExists',
        message: 'This date is a holiday',
      };
    } else if (date.getDay() === 0) {
      throw {
        type: 'HolidayExists',
        message: 'This date is a sunday',
      };
    }
    // else console.log('This date is not a holiday');

    const existingSession = await this.sessionRepository.find({
      where: {
        date: addSessionDto.date,
        sessionType: {
          group: {
            sector: getGroupDto.sector,
            level: getGroupDto.level,
            group: getGroupDto.group,
          },
        },
      },
    });
    if (existingSession.length > 0) {
      throw {
        type: 'SessionExists',
        message: 'This date already has a session for this group',
      };
    }

    const group = await this.groupService.findBySectorGroupLevel(getGroupDto);
    const session = new SessionEntity();
    session.name = addSessionDto.name;

    // const date = new Date(addSessionDto.date);
    const endTime = new Date(addSessionDto.endTime);
    console.log(date);
    session.date = date;
    session.endTime = endTime;

    const sessionType = new SessionTypeEntity();

    sessionType.type = SessionTypeEnum.Rattrapage;

    sessionType.group = group;

    // Create a mapping from day numbers to day names
    const dayMapping = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };

    // Store the day name in sessionType.day
    sessionType.day = dayMapping[date.getDay()];

    // Convert the start and end times to strings in the format 'HH:mm'
    sessionType.startHour =
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0');
    sessionType.endHour =
      endTime.getHours().toString().padStart(2, '0') +
      ':' +
      endTime.getMinutes().toString().padStart(2, '0');

    session.sessionType = sessionType;
    await this.sessionTypeRepository.save(sessionType);
    await this.sessionRepository.save(session);
    return session;
  }

  /*  async findAll() {
    return await this.sessionRepository.find();
  }*/

  async findAll() {
    const result = await this.sessionRepository.find({
      relations: ['sessionType', 'sessionType.subject'],
      order: {
        date: 'ASC', // 'ASC' for ascending and 'DESC' for descending
      },
    });

    result.forEach((session) => {
      session.name = session.sessionType.subject.name;
      session.type = session.sessionType.type;
    });

    return result;
  }

  async findOne(id: number) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundError('Session not found');
    }
    const { sessionType } = session;
    if (sessionType) {
      const { subject, ...filteredSessionType } = sessionType;

      const rank = await this.countSessionRank(session);
      return {
        ...session,
        sessionType: filteredSessionType,
        rank: rank,
      };
    }
    return session;
  }
  async findOneForGuard(id: number) {
    const session = await this.sessionRepository.findOne({
      where: { id },
    });

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    if (session.sessionType) {
      const sessionTypeWithTeacher = await this.sessionRepository.manager
        .getRepository(SessionTypeEntity)
        .findOne({
          where: { id: session.sessionType.id },
          relations: ['teacher'],
        });

      if (sessionTypeWithTeacher) {
        session.sessionType.teacher = sessionTypeWithTeacher.teacher;
      }
    }

    return session;
  }

  async countSessionRank(session: SessionEntity) {
    const { sessionType } = session;
    const sessions = await this.sessionRepository.find({
      where: { sessionType: { id: sessionType.id } },
      order: { date: 'ASC' },
      relations: ['sessionType'],
    });
    // console.log("sessions",sessions);
    const sessionIndex = sessions.findIndex((s) => s.id === session.id);

    return sessionIndex + 1;
  }
  // this function is used to find all sessions of a certain group(level, sector, group) returns a dto, not the entity
  async findSessionsOfSectorLevelGroup(getGroupDto: GetGroupDto) {
    const sessionsOfSectorLevel = await this.sessionRepository.find({
      relations: ['sessionType', 'sessionType.group', 'sessionType.subject'],
      where: {
        sessionType: {
          group: {
            sector: getGroupDto.sector,
            level: getGroupDto.level,
          },
        },
      },
    });
    console.log('sessionofsector level ', sessionsOfSectorLevel);

    const lectureSessions = sessionsOfSectorLevel.filter(
      (session) => session.sessionType.type === SessionTypeEnum.Lecture,
    );
    console.log('lectureSessions', lectureSessions);

    const sessions = await this.sessionRepository.find({
      relations: ['sessionType', 'sessionType.group', 'sessionType.subject'],
      where: {
        sessionType: {
          group: {
            sector: getGroupDto.sector,
            level: getGroupDto.level,
            group: getGroupDto.group,
          },
        },
      },
    });
    console.log('session', sessions);

    // Check if lectureSessions already exists in sessions
    const isLectureSessionExists = sessions.some((session) =>
      lectureSessions.find(
        (lectureSession) => lectureSession.id === session.id,
      ),
    );

    // If lectureSessions does not exist in sessions, add it
    if (!isLectureSessionExists) {
      sessions.push(...lectureSessions);
    }

    /*
    const sessions = await this.sessionRepository.find({
      relations: ['sessionType', 'sessionType.group', 'sessionType.subject'],
      where: {
        sessionType: {
          group: {
            sector: getGroupDto.sector,
            level: getGroupDto.level,
            group: getGroupDto.group,
          },
        },
      },
    });
*/

    const getSessionsDto: GetSessionDto[] = sessions.map((session) => {
      if (!session.sessionType) {
        return {
          id: session.id,
          StartTime: session.date,
          EndTime: session.endTime,
          holidayName: session.holidayName,
          type: SessionTypeEnum.Holiday,
          name: session.name,
        };
      }
      return {
        id: session.id,
        StartTime: session.date,
        EndTime: session.endTime,
        holidayName: session.holidayName,
        type: session.sessionType.type,
        name: session.name ? session.name : session.sessionType.subject.name,
      };
    });

    return getSessionsDto;
  }

  //this function is used to find a holiday by date
  async findOneHoliday(date: Date | string) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const dateToFind = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
    const session = await this.sessionRepository.findOne({
      where: { date: dateToFind },
    });
    /*    if (!session) {
      throw new Error('Holiday Session not found');
    }*/
    return session;
  }

    async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new Error('Session not found');
    } else {
      return await this.sessionRepository.update(id, updateSessionDto);
    }
  }

  // async remove(id: number, groupDto: GetGroupDto) {
  //   const sessions = await this.findSessionsOfSectorLevelGroup(groupDto);
  //   const session = sessions.find((session) => session.id === id);
  //   if (!session) {
  //     throw new Error('Session not found');
  //   } else {
  //     return await this.sessionRepository.softRemove(session);
  //   }
  // }

  async remove(id : number) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    } else {
      return await this.sessionRepository.remove(session);
    }
  }

  async recover(id: number) {
    const session = await this.sessionRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!session) {
      throw new Error('Session not found');
    } else {
      return await this.sessionRepository.recover(session);
    }
  }

  async findByTeacher(teacherId: number): Promise<SessionEntity[]> {
    const result = await this.sessionRepository.find({
      relations: ['sessionType', 'sessionType.teacher', 'sessionType.subject'],
      where: {
        sessionType: {
          teacher: {
            id: teacherId,
          },
        },
      },
    });
    result.forEach((session) => {
      session.name = session.sessionType.subject.name;
      session.type = session.sessionType.type;
    });
    return result;
  }

  async getStudentsFromSessionId(sessionId: number) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['sessionType', 'sessionType.group'],
    });
    console.log('session', session);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    let students: Student[];
    if (session?.sessionType.type !== SessionTypeEnum.Lecture) {
      const groupId = session.sessionType.group.id;
      students = await this.sessionRepository.manager
        .getRepository(Student)
        .find({
          where: { group: { id: groupId } },
          relations: ['group'],
        });
    } else {
      const sectorLevel = session.sessionType.group.sectorLevel;
      students = await this.sessionRepository.manager
        .getRepository(Student)
        .find({
          where: { group: { sectorLevel: sectorLevel } },
          relations: ['group'],
        });
    }

    return students.map((student) => {
      return {
        id: student.id,
        username: student.username,
        email: student.email,
        photo: student.photo,
        enrollmentNumber: student.enrollmentNumber,
        group: student.group,
      };
    });
  }
}
