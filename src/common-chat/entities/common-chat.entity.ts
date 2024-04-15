import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';

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
  // @ManyToOne(()=> SessionEntity, {
  //   nullable: false,
  // })
  // session: SessionEntity;
}
