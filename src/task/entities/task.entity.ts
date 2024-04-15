import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SessionEntity } from '../../session/entities/session.entity';
@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  isDone: boolean;
  // @ManyToOne(()=>UserEntity, {
  //   nullable: false,
  // })
  // user: UserEntity;
  @ManyToOne(() => SessionEntity, {
    nullable: false,
  })
  session: SessionEntity;
}
