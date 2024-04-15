import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionEntity } from '../../session/entities/session.entity';
@Entity('common-chat')
export class CommonChatEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  // @ManyToOne(()=> UserEntity, {
  //   nullable: false,
  // })
  // author: UserEntity;
  @Column()
  parentId: number;
  @ManyToOne(() => SessionEntity, {
    nullable: false,
  })
  session: SessionEntity;
}
