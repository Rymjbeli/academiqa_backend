import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { Student } from '../../user/entities/student.entity';
import { SessionEntity } from '../../session/entities/session.entity';
@Entity('presence')
export class PresenceEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => SessionEntity, {
    nullable: false,
    eager: true,
  })
  session: SessionEntity;
  @ManyToOne(() => Student, (student) => student.presences, {
    nullable: false,
  })
  student: Student;
}
