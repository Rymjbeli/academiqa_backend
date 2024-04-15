import { ChildEntity, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbsenceEntity } from '../../absence/entities/absence.entity';
import { NoteEntity } from '../../note/entities/note.entity';
@ChildEntity()
export class StudentEntity extends UserEntity {
  @Column()
  sector: string;
  @Column()
  group: number;
  @Column()
  level: string;
  @Column()
  sectorLevel: string;
  @Column()
  nbAbsence: number;
  @Column()
  photo: string;
  @Column()
  enrollmentNumber: number;
  @OneToMany(() => AbsenceEntity, (absence) => absence.student, {
    nullable: true,
  })
  absences: AbsenceEntity[];
  @OneToMany(() => NoteEntity, (note) => note.student, {
    nullable: true,
  })
  notes: NoteEntity[];
}
