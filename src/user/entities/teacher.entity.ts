import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { TaskEntity } from '../../task/entities/task.entity';
import { AnnouncementEntity } from '../../announcement/entities/announcement.entity';
@ChildEntity()
export class Teacher extends User {
  @Column()
  speciality: string;
  // @OneToMany(() => SubjectEntity, (subject) => subject.teacher, {
  //   nullable: true,
  // })
  // subjects: SubjectEntity[];
  @OneToMany(() => TaskEntity, (task) => task.teacher, {
    nullable: true,
  })
  tasks: TaskEntity[];
  @OneToMany(() => AnnouncementEntity, (announcement) => announcement.teacher, {
    nullable: true,
  })
  announcements: AnnouncementEntity[];
}
