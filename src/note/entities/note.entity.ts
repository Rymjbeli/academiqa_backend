import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionEntity } from '../../session/entities/session.entity';
import { StudentEntity } from '../../user/entities/student.entity';
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
  @ManyToOne(() => StudentEntity, (user) => user.notes, {
    nullable: false,
  })
  student: StudentEntity;
  @ManyToOne(() => SessionEntity, (session) => session.notes, {
    nullable: false,
  })
  session: SessionEntity;
}
