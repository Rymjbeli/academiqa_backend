import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionTypeEnum } from '../../Enums/session-type.enum';
import { Session } from '../../session/entities/session.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('session_type')
export class SessionType extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  day: string;

  @Column()
  startHour: Date;

  @Column()
  endHour: Date;

  @Column({
    type: 'enum',
    enum: SessionTypeEnum,
    default: SessionTypeEnum.Lecture,
  })
  type: SessionTypeEnum;

  @OneToMany(() => Session, (session) => session.sessionType)
  sessions: Session[];

  @ManyToOne(() => Subject, (subject) => subject.sessionTypes)
  subject: Subject;
}
