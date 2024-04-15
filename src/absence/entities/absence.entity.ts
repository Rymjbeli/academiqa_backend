import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';

export class AbsenceEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  absenceNumber: number;
  // @ManyToOne(()=>SubjectEntity, {
  //    nullable: false,
  //  })
  //  subject: SubjectEntity;
  //  @ManyToOne(()=>UserEntity, (user)=>user.absences, {
  //    nullable: false,
  //  })
  //  student: UserEntity;
}
