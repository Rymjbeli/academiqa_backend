import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SubjectEntity } from '../../subject/entities/subject.entity';
@Entity('announcement')
export class Announcement extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @ManyToOne(() => SubjectEntity, { nullable: false })
  subject: SubjectEntity;
  // @ManyToOne(()=>UserEntity,{
  //   nullable: false,
  // })
  // user: UserEntity;
}
