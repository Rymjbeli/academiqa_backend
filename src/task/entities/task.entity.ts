import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SessionEntity } from '../../session/entities/session.entity';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { TeacherEntity } from '../../user/entities/teacher.entity';
@Entity('task')
export class TaskEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  isDone: boolean;
  @ManyToOne(() => TeacherEntity, (teacher) => teacher.tasks, {
    nullable: false,
  })
  teacher: TeacherEntity;
  @ManyToOne(() => SessionEntity, (session) => session.tasks, {
    nullable: false,
  })
  session: SessionEntity;
}
