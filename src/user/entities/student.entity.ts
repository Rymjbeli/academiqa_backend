import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { AbsenceEntity } from '../../absence/entities/absence.entity';
import { NoteEntity } from '../../note/entities/note.entity';
@ChildEntity()
export class Student extends User {
  @Column()
  speciality: string;
  @Column()
  group: number;
  @Column()
  level: string;
  @Column()
  sectorLevel: string;
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
