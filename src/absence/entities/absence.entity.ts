import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class AbsenceEntity {
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
