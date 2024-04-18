import { ChildEntity, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbsenceEntity } from '../../absence/entities/absence.entity';
import { NoteEntity } from '../../note/entities/note.entity';
import { GroupEntity } from '../../group/entities/group.entity';
@ChildEntity()
export class StudentEntity extends UserEntity {
  @ManyToOne(() => GroupEntity, {
    nullable: false,
  })
  group: GroupEntity;
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
