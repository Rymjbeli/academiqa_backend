import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { TeacherEntity } from '../../user/entities/teacher.entity';
@Entity('announcement')
export class AnnouncementEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @ManyToOne(() => SubjectEntity, (subject) => subject.announcements, {
    nullable: false,
  })
  subject: SubjectEntity;
  @ManyToOne(() => TeacherEntity, (teacher) => teacher.announcements, {
    nullable: false,
  })
  teacher: TeacherEntity;
}
