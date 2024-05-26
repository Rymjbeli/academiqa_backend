import { ChildEntity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { NoteEntity } from '../../note/entities/note.entity';
import { GroupEntity } from '../../group/entities/group.entity';
import { ChatbotDiscussionsEntity } from '../../chatbot/Entities/chatbot-discussions.entity';
import { PresenceEntity } from "../../presence/entities/presence.entity";
@ChildEntity()
export class Student extends User {
  @ManyToOne(() => GroupEntity, {
    nullable: true,
  })
  group: GroupEntity;
  @Column()
  enrollmentNumber: number;
  @OneToMany(() => PresenceEntity, (presence) => presence.student, {
    nullable: true,
  })
  presences: PresenceEntity[];
  @OneToMany(() => NoteEntity, (note) => note.student, {
    nullable: true,
  })
  notes: NoteEntity[];
}
