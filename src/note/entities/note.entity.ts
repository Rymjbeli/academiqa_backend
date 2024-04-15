import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
@Entity('note')
export class NoteEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  title: string;
  // @ManyToOne(()=>UserEntity, (user)=>user.notes, {
  //   nullable: false,
  // })
  // user: UserEntity;
  // @ManyToOne(()=>SessionEntity, (session)=>session.notes, {
  //   nullable: false,
  // })
  // session: SessionEntity;
}
