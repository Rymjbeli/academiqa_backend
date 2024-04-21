import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column()
  parentId: number;
  @ManyToOne(() => SessionEntity, (session) => session.commonChats, {
    nullable: false,
  })
  session: SessionEntity;
}
