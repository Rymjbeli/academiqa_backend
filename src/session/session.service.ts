import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
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
      Lundi: 1,
      Mardi: 2,
      Mercredi: 3,
      Jeudi: 4,
      Vendredi: 5,
      Samedi: 6,
      Dimanche: 0,
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
        createSessionDto.sessionType = sessionType;
        const session = await this.createSession(createSessionDto);
        sessions.push(session);
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

    const date = new Date(addSessionDto.date);
    const endTime = new Date(addSessionDto.endTime);
    console.log(date);
    session.date = date;
    session.endTime = endTime;

    const sessionType = new SessionTypeEntity();

    sessionType.type = SessionTypeEnum.Rattrapage;

    sessionType.group = group;
    sessionType.day = date.getDay().toString();

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
    return await this.sessionRepository.find({
      order: {
        date: 'ASC', // 'ASC' for ascending and 'DESC' for descending
      },
    });
  }

  async findOne(id: number) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundError('Session not found');
    }
    return session;
  }

  // this function is used to find all sessions of a certain group(level, sector, group) returns a dto, not the entity
  async findSessionsOfSectorLevelGroup(getGroupDto: GetGroupDto) {
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

    const getSessionsDto: GetSessionDto[] = sessions.map((session) => {
      return {
        id: session.id,
        StartTime: session.date,
        EndTime: session.endTime,
        holidayName: session.holidayName,

        type: session.sessionType.type,

        name: session.name,
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

  /*  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new Error('Session not found');
    } else {
      return await this.sessionRepository.update(id, updateSessionDto);
    }
  }*/

  async remove(id: number, groupDto: GetGroupDto) {
    const sessions = await this.findSessionsOfSectorLevelGroup(groupDto);
    const session = sessions.find((session) => session.id === id);
    if (!session) {
      throw new Error('Session not found');
    } else {
      return await this.sessionRepository.softRemove(session);
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
}
