import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';

export class Announcement extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  // @ManyToOne(()=>SubjectEntity,{
  // subject: SubjectEntity;
  // @ManyToOne(()=>UserEntity,{
  //   nullable: false,
  // })
  // user: UserEntity;
}
