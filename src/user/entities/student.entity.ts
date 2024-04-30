import { ChildEntity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { AbsenceEntity } from '../../absence/entities/absence.entity';
import { NoteEntity } from '../../note/entities/note.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { ChatbotDiscussionsEntity } from "../../chatbot/Entities/chatbot-discussions.entity";
@ChildEntity()
export class Student extends User {
  @ManyToOne(() => GroupEntity, {
    nullable: true,
  })
  group: GroupEntity;
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
