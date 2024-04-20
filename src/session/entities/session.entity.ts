import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';
import { CommonChatEntity } from '../../common-chat-session/entities/common-chat.entity';
import { NoteEntity } from '../../note/entities/note.entity';
import { RessourceEntity } from '../../ressource/entities/ressource.entity';
import { TaskEntity } from '../../task/entities/task.entity';

@Entity('session')
export class SessionEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => SessionTypeEntity, (sessionType) => sessionType.sessions, {
    nullable: false,
  })
  sessionType: SessionTypeEntity;
  // @OneToMany(() => CommonChatEntity, (commonChat) => commonChat.session, {
  //   nullable: true,
  // })
  // commonChats: CommonChatEntity[];
  /*  @OneToMany(() => NoteEntity, (note) => note.session)
  notes: NoteEntity[];*/
  @OneToMany(() => RessourceEntity, (ressource) => ressource.session, {
    nullable: true,
  })
  ressources: RessourceEntity[];
  /*  @OneToMany(() => TaskEntity, (task) => task.session, { nullable: true })
  tasks: TaskEntity[];*/
}
