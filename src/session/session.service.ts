import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionTypeEntity } from '../session-type/entities/session-type.entity';
import { SessionEntity } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionTypeService } from '../session-type/session-type.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,

    private sessionTypeService: SessionTypeService,
  ) {}

  // let semesterStartDate = '2022-09-01';
  async generateSessionsForOneSessionType(
    sessionType: SessionTypeEntity,
    numberOfWeeks: number,
    semesterStartDate: string,
    holidays: { date: string; name: string }[] = [],
  ) {
    const sessions = [];
    const dayMapping = {
      Lundi: 1,
      Mardi: 2,
      Mercredi: 3,
      Jeudi: 4,
      Vendredi: 5,
      Samedi: 6,
      Dimanche: 0,
    };
    for (let i = 0; i < numberOfWeeks; i++) {
      const session = new SessionEntity();
      const date = new Date(semesterStartDate);
      date.setDate(
        date.getDate() + 7 * i + (dayMapping[sessionType.day] - date.getDay()),
      );
      if (date < new Date(semesterStartDate)) {
        continue;
      }
      const dateString = date.toISOString().split('T')[0];
      const holidayNames = holidays
        .filter((holiday) => holiday.date === dateString)
        .map((holiday) => holiday.name);
      if (holidayNames.length > 0) {
        const existingSession = await this.sessionRepository.findOne({
          where: { date },
        });

        if (existingSession) {
          existingSession.holidayName = holidayNames;
          await this.sessionRepository.save(existingSession);
          sessions.push(existingSession);
          continue;
        }
        const newDate = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 1,
            1,
            0,
            0,
          ),
        );
        session.date = newDate;
        console.log('the ', date);

        // Create the endTime in UTC
        const endTime = new Date(
          Date.UTC(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
            0,
            59,
            59,
          ),
        );
        session.endTime = endTime;
        console.log('the the ', endTime);

        session.holidayName = holidayNames;
        await this.sessionRepository.save(session);
        sessions.push(session);
        continue;
      }
      const [startHours, startMinutes] = sessionType.startHour
        .split(':')
        .map(Number);
      date.setHours(startHours);
      date.setMinutes(startMinutes);
      date.setSeconds(0);
      session.date = date;
      const [endHours, endMinutes] = sessionType.endHour.split(':').map(Number);
      const endDate = new Date(date);
      endDate.setHours(endHours);
      endDate.setMinutes(endMinutes);
      session.endTime = endDate;
      session.sessionType = sessionType;
      await this.sessionRepository.save(session);
      sessions.push(session);
    }
    return sessions;
  }

  async generateSessionsForAllSessionTypes(
    numberOfWeeks: number,
    semesterStartDate: string,
    holidays: { date: string; name: string }[],
  ) {
    const sessionTypes = await this.sessionTypeService.findAll();
    const sessions = await Promise.all(
      sessionTypes.map((sessionType) =>
        this.generateSessionsForOneSessionType(
          sessionType,
          numberOfWeeks,
          semesterStartDate,
          holidays,
        ),
      ),
    );
    return sessions.flat();
  }

  async findAll() {
    return await this.sessionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
