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
import { SessionTypeEnum } from '../../Enums/session-type.enum';

@Entity('session')
export class SessionEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name?: string;

  @Column()
  date: Date;

  @Column()
  endTime: Date;

  @Column('simple-array', { nullable: true })
  holidayName?: string[];

  @ManyToOne(() => SessionTypeEntity, (sessionType) => sessionType.sessions, {
    eager: true,
    nullable: true,
  })
  sessionType: SessionTypeEntity;
  @OneToMany(() => NoteEntity, (note) => note.session)
  notes: NoteEntity[];
  @OneToMany(() => CommonChatEntity, (commonChat) => commonChat.session, {
    nullable: true,
  })
  commonChats: CommonChatEntity[];
  @OneToMany(() => RessourceEntity, (ressource) => ressource.session, {
    nullable: true,
  })
  ressources: RessourceEntity[];
  @OneToMany(() => TaskEntity, (task) => task.session, { nullable: true })
  tasks: TaskEntity[];
  type: SessionTypeEnum;
}
