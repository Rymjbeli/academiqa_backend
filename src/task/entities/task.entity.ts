import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SessionEntity } from '../../session/entities/session.entity';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { Teacher } from '../../user/entities/teacher.entity';
@Entity('task')
export class TaskEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  isDone: boolean;
  @ManyToOne(() => Teacher, (teacher) => teacher.tasks, {
    nullable: false,
  })
  teacher: Teacher;
  @ManyToOne(() => SessionEntity, (session) => session.tasks, {
    nullable: false,
  })
  session: SessionEntity;
}
