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

@Entity('session_type')
export class SessionTypeEntity extends TimestampEntites {
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

  @OneToMany(() => SessionEntity, (session) => session.sessionType, {
    nullable: false,
  })
  sessions: SessionEntity[];

  @ManyToOne(() => SubjectEntity, (subject) => subject.sessionTypes, {
    nullable: false,
  })
  subject: SubjectEntity;
}
