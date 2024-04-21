import { ChildEntity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { AbsenceEntity } from '../../absence/entities/absence.entity';
import { NoteEntity } from '../../note/entities/note.entity';
import { GroupEntity } from '../../group/entities/group.entity';
@ChildEntity()
export class Student extends User {
  @ManyToOne(() => GroupEntity, {
    nullable: true,
  })
  group: GroupEntity;
  @Column()
  photo: string;
  @Column()
  enrollmentNumber: number;
  @Column()
  cin: number;
  @OneToMany(() => AbsenceEntity, (absence) => absence.student, {
    nullable: true,
  })
  absences: AbsenceEntity[];
  @OneToMany(() => NoteEntity, (note) => note.student, {
    nullable: true,
  })
  notes: NoteEntity[];
}
