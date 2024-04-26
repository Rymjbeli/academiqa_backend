import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionEntity } from '../../session/entities/session.entity';
import { Student } from '../../user/entities/student.entity';
@Entity('note')
export class NoteEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'text',
  })
  content: string;
  @Column()
  title: string;
  @ManyToOne(() => Student, (user) => user.notes, {
    nullable: false,
  })
  student: Student;
  // @ManyToOne(() => SessionEntity, (session) => session.notes, {
  //   nullable: false,
  // })
  // session: SessionEntity;
}
