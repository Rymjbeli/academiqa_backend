import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SubjectEntity } from '../../subject/entities/subject.entity';
@Entity('absence')
export class AbsenceEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  absenceNumber: number;
  @ManyToOne(() => SubjectEntity, {
    nullable: false,
  })
  subject: SubjectEntity;
  //  @ManyToOne(()=>UserEntity, (user)=>user.absences, {
  //    nullable: false,
  //  })
  //  student: UserEntity;
}
