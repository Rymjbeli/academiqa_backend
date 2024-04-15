import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  // @ManyToOne(()=>SessionEntity,  {
  //   nullable: false,
  // })
  // session: SessionEntity;
}
