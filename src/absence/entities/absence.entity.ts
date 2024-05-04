import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { Student } from '../../user/entities/student.entity';
import { SessionEntity } from '../../session/entities/session.entity';
@Entity('absence')
export class AbsenceEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => SessionEntity, {
    nullable: false,
  })
  session: SessionEntity;
  @ManyToOne(() => Student, (student) => student.absences, {
    nullable: false,
  })
  student: Student;
}
