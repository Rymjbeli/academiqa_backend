import { Injectable } from '@nestjs/common';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PresenceEntity } from './entities/presence.entity';
import {
  IsNull,
  LessThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { SessionEntity } from '../session/entities/session.entity';
import { StudentService } from '../user/student/student.service';
import { SessionTypeEntity } from '../session-type/entities/session-type.entity';
import { SubjectService } from '../subject/subject.service';
import { User } from '../user/entities/user.entity';
import { Student } from "../user/entities/student.entity";

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
    private readonly subjectService: SubjectService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
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
      .leftJoin('sessionType.group', 'group')
      .leftJoinAndSelect('sessionType.subject', 'subject')
      .leftJoinAndSelect('group.students', 'students')
      .andWhere(
        'NOT EXISTS (SELECT * FROM presence WHERE presence.sessionId = session.id AND presence.studentId = students.id)',
      );
  }
  private FilterYear(query: SelectQueryBuilder<SessionEntity>, year: number) {
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
    sectorlevels: [string],
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

  async fetchAndPrepareData(id: number) {
    const student = await this.studentService.findOneStudent(id);
    if (!student) {
      throw new Error('Student not found');
    }
    const group = student.group;
    const sectorLevel = group.sectorLevel;
    const sessionTypes = await this.sessionTypesRepository.find({
      where: { group: { sectorLevel: sectorLevel } },
      relations: ['sessions', 'subject'],
    });
    const filteredSessionTypes = sessionTypes.filter((sessionType) => {
      return (
        sessionType.type === 'Lecture' || sessionType.group.id === group.id
      );
    });
    const sessions = filteredSessionTypes
      .map((sessionType) => {
        return sessionType.sessions.map((session) => {
          return { ...session, subject: sessionType.subject };
        });
      })
      .flat();
    const currentDate = new Date();
    const pastSessions = sessions.filter(
      (session) => session.endTime < currentDate,
    );
    const presences = await this.presenceRepository.find({
      where: { student: student },
    });

    return { pastSessions, presences, sectorLevel };
  }

  async calculateAbsences(pastSessions, presences, sectorLevel) {
    const absentSessions = pastSessions.filter((session) => {
      return !presences.some((presence) => presence.session.id === session.id);
    });
    const absences = absentSessions.reduce((acc, session) => {
      const subjectName = session.subject.name;
      const subjectModule = session.subject.module;

      const key = `${subjectName}-${subjectModule}`;

      if (!acc[key]) {
        acc[key] = {
          name: subjectName,
          id: session.subject.id,
          module: subjectModule,
          numberOfAbsence: 1,
        };
      } else {
        acc[key].numberOfAbsence++;
      }

      return acc;
    }, {});
    const allSubjects =
      await this.subjectService.findBySectorLevel(sectorLevel);
    return allSubjects.map((subject) => {
      const key = `${subject.name}-${subject.module}`;
      return {
        ...subject,
        numberOfAbsence: absences[key] ? absences[key].numberOfAbsence : 0,
      };
    });
  }

  async getAbsencesForOneStudent(id: number) {
    const { pastSessions, presences, sectorLevel } =
      await this.fetchAndPrepareData(id);
    return this.calculateAbsences(pastSessions, presences, sectorLevel);
  }

  async getAverageAbsence(): Promise<number> {
    const currentDate = new Date(new Date().toISOString().split('T')[0]);

    const totalSessions = await this.sessionRepository.count({
      where: {
        date: LessThanOrEqual(currentDate),
        deletedAt: IsNull(),
      },
    });

    if (totalSessions === 0) {
      return 0; // Avoid division by zero
    }

    const studentAttendance = await this.presenceRepository
      .createQueryBuilder('presence')
      .select('presence.studentId', 'studentId')
      .addSelect('COUNT(presence.id)', 'attendedSessions')
      .innerJoin(SessionEntity, 'session', 'presence.sessionId = session.id')
      .where('session.date <= :currentDate', { currentDate })
      .andWhere('presence.deletedAt IS NULL')
      .groupBy('presence.studentId')
      .getRawMany();

    const studentAbsences = await this.userRepository
      .createQueryBuilder('user')
      .select('user.id', 'studentId')
      .addSelect(
        `:totalSessions - COALESCE(sa.attendedSessions, 0)`,
        'absences',
      )
      .leftJoin(
        (qb) =>
          qb.from(
            (subQuery) =>
              subQuery
                .select('presence.studentId', 'studentId')
                .addSelect('COUNT(presence.id)', 'attendedSessions')
                .from(PresenceEntity, 'presence')
                .innerJoin(
                  SessionEntity,
                  'session',
                  'presence.sessionId = session.id',
                )
                .where('session.date <= :currentDate', { currentDate })
                .andWhere('presence.deletedAt IS NULL')
                .groupBy('presence.studentId'),
            'sa',
          ),
        'sa',
        'user.id = sa.studentId',
      )
      .setParameter('totalSessions', totalSessions)
      .where('user.role = :role', { role: 'Student' })
      .andWhere('user.deletedAt IS NULL')
      .getRawMany();

    const totalAbsences = studentAbsences.reduce(
      (sum, student) => sum + parseInt(student.absences),
      0,
    );
    const numberOfStudents = studentAbsences.length;
    const averageAbsencePercentage =
      (totalAbsences / (numberOfStudents * totalSessions)) * 100;

    return parseFloat(averageAbsencePercentage.toFixed(2));
  }

  // async getAbsencesAndCoursesForAdmin(id: number) {
  //   const { pastSessions, presences } = await this.fetchAndPrepareData(id);
  //   return this.calculateAbsences(pastSessions, presences);
  // }

  async getSectorMonthlyAbsence(year: number) {
    return await this.constructQuery()
      .addSelect('MONTH(session.endTime)', 'month') // Alias the month field properly
      .groupBy('group.sectorLevel, month')
      .select('group.sectorLevel', 'Label')
      .addSelect('MONTH(session.endTime)', 'Month')
      .addSelect(
        'COUNT(students.id)/(select count(*)*(select count(*) from session as e where exists(select * from session_type as st where st.id = e.sessionTypeId AND st.groupId = group.id)) from user as s where s.groupId = group.id)*100',
        'Absence',
      )
      .getRawMany();
  }
}
