import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { StudentEntity } from '../../user/entities/student.entity';
@Entity('absence')
export class AbsenceEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  absenceNumber: number;
  @ManyToOne(() => SubjectEntity, (subject) => subject.absences, {
    nullable: false,
  })
  subject: SubjectEntity;
  @ManyToOne(() => StudentEntity, (student) => student.absences, {
    nullable: false,
  })
  student: StudentEntity;
}
