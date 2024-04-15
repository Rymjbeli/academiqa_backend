import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionEntity } from '../../session/entities/session.entity';
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
  @ManyToOne(() => SessionEntity, {
    nullable: false,
  })
  session: SessionEntity;
}
