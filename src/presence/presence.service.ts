import { Injectable } from '@nestjs/common';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PresenceEntity } from './entities/presence.entity';
import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { Student } from '../user/entities/student.entity';
import { SessionEntity } from '../session/entities/session.entity';
import { GroupEntity } from '../group/entities/group.entity';
import { StudentService } from '../user/student/student.service';
import { SessionTypeEntity } from "../session-type/entities/session-type.entity";

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(PresenceEntity)
    private readonly presenceRepository: Repository<PresenceEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly studentService: StudentService,
    @InjectRepository(SessionTypeEntity)
    private readonly sessionTypesRepository: Repository<SessionTypeEntity>,
  ) {}
  async findPresence(createPresenceDto: CreatePresenceDto) {
    const { session, student } = createPresenceDto;
    return await this.presenceRepository.findOne({
      where: {
        session,
        student,
      },
    });
  }
  async delete(id: number) {
    return await this.presenceRepository.delete(id);
  }
  async create(createPresenceDto: CreatePresenceDto) {
    const newPresence = this.presenceRepository.create(createPresenceDto);
    return await this.presenceRepository.save(newPresence);
  }

  private constructQuery() {
    const currentDate = new Date();
    return this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.sessionType', 'sessionType')
      .where('session.endTime < :currentDate', { currentDate })
      .andWhere('session.holidayName is NULL')
      .leftJoin("sessionType.group", "group")
      .leftJoinAndSelect('sessionType.subject', 'subject')
      .leftJoinAndSelect('group.students', 'students')
      .andWhere(
        'NOT EXISTS (SELECT * FROM presence WHERE presence.sessionId = session.id AND presence.studentId = students.id)',
      );
  }
  private FilterYear(query: SelectQueryBuilder<SessionEntity>, year: Number) {
    if (!year) {
      const currentyear = new Date().getFullYear();
      query = query.andWhere('EXTRACT(YEAR FROM session.date) = :year', {
        year: year,
      });
    } else {
      query = query.andWhere('EXTRACT(YEAR FROM session.date) = :year', {
        year: year,
      });
    }
    return query;
  }
  private FilterbySectorLevels(
    query: SelectQueryBuilder<SessionEntity>,
    sectorlevels: [String],
  ) {
    if (sectorlevels) {
      query = query.andWhere('group.sectorLevel IN (:...sectorlevels)', {
        sectorlevels: sectorlevels,
      });
    }
    return query;
  }
  private FilterBySectorName(
    query: SelectQueryBuilder<SessionEntity>,
    sectorNames: [string],
  ) {
    if (sectorNames) {
      query = query.andWhere('group.sector IN (:...sector)', {
        sector: sectorNames,
      });
    }
    return query;
  }
  private FilterBySubjectName(
    query: SelectQueryBuilder<SessionEntity>,
    subjectNames: [string],
  ) {
    if (subjectNames) {
      query = query.andWhere('subject.name IN (:...subjectNames)', {
        subjectNames: subjectNames,
      });
    }
    return query;
  }

  async getSectorsAbsence() {
    //get all groups, grouped by sector level, join in sessions with session types associated with the group
    return await this.constructQuery()
      .groupBy('group.sectorLevel')
      .select('group.sectorLevel , COUNT(students.id)', 'sectorLevel, absence')
      .getRawMany();
  }

  async getAbsencesForOneStudent(id: number) {
    const student = await this.studentService.findOneStudent(id);
    if (!student) {
      throw new Error('Student not found');
    }
    const group = student.group;
    const sectorLevel = group.sectorLevel;
    const sessionTypes = await this.sessionTypesRepository.find({
      where: { group: {sectorLevel: sectorLevel} },
      relations: ['sessions', 'subject'],
    });
    const filteredSessionTypes = sessionTypes.filter(sessionType => {
      return sessionType.type === 'Lecture' || sessionType.group.id === group.id;
    });
    const sessions = filteredSessionTypes.map(sessionType => {
      return sessionType.sessions.map(session => {
        return { ...session, subject: sessionType.subject };
      });
    }).flat();
    const currentDate = new Date();
    const pastSessions = sessions.filter(session => session.endTime < currentDate);
    const presences = await this.presenceRepository.find({
      where: { student: student },
    });
    const absentSessions = pastSessions.filter(session => {
      return !presences.some(presence => presence.session.id === session.id);
    });
    const absences = absentSessions.reduce((acc, session) => {
      const subjectName = session.subject.name;
      const subjectModule = session.subject.module;

      const key = `${subjectName}-${subjectModule}`;

      if (!acc[key]) {
        acc[key] = {
          course: subjectName,
          module: subjectModule,
          nbAbsence: 1,
        };
      } else {
        acc[key].nbAbsence++;
      }

      return acc;
    }, {});

    return Object.values(absences);
    }
  async getSectorMonthlyAbsence(year: number) {
    return await this.constructQuery()
      .addSelect('MONTH(session.endTime)', 'month') // Alias the month field properly
      .groupBy('group.sectorLevel, month')
      .select(
        'group.sectorLevel', 'Label'
      )
      .addSelect(
        'MONTH(session.endTime)', 'Month'
      )
      .addSelect(
        'COUNT(students.id)', 'Absence'
      )
      .getRawMany();
  }

}
