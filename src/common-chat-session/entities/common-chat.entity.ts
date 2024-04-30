import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionEntity } from '../../session/entities/session.entity';
import { User } from '../../user/entities/user.entity';
@Entity('common-chat')
export class CommonChatEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @ManyToOne(() => User, {
    nullable: false,
  })
  author: User;
  @ManyToOne(() => CommonChatEntity, {
    nullable: true,
  })
  parent: CommonChatEntity;
  @OneToMany(() => CommonChatEntity, (commonChat) => commonChat.parent, {
    nullable: true,
    cascade: ['soft-remove'],
  })
  replies: CommonChatEntity[];

  @ManyToOne(() => SessionEntity, (session) => session.commonChats, {
    nullable: true,
  })
  session: SessionEntity;
}
