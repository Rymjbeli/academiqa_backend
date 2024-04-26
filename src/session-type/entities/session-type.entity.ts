import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionTypeEnum } from '../../Enums/session-type.enum';
import { SessionEntity } from '../../session/entities/session.entity';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { Teacher } from '../../user/entities/teacher.entity';

@Entity('session_type')
export class SessionTypeEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  day: string;

  @Column('time')
  startHour: string;

  @Column('time')
  endHour: string;

  @Column({
    type: 'enum',
    enum: SessionTypeEnum,
    default: SessionTypeEnum.Lecture,
  })
  type: SessionTypeEnum;

  @OneToMany(() => SessionEntity, (session) => session.sessionType, {
    nullable: false,
  })
  sessions: SessionEntity[];


  @ManyToOne(() => Teacher, (teacher) => teacher.sessionTypes, {
    nullable: false,
  })
  teacher: Teacher;


  @ManyToOne(() => GroupEntity, {
    nullable: false,
  })
  group: GroupEntity;

  @ManyToOne(() => SubjectEntity, (subject) => subject.sessionTypes, {
    nullable: false,
  })
  subject: SubjectEntity;
}
