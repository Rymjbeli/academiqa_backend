import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { TaskEntity } from '../../task/entities/task.entity';
import { AnnouncementEntity } from '../../announcement/entities/announcement.entity';
import { SessionTypeEntity } from "../../session-type/entities/session-type.entity";
@ChildEntity()
export class Teacher extends User {
  @Column()
  speciality: string;

  @OneToMany(() => TaskEntity, (task) => task.teacher, {
    nullable: true,
  })
  tasks: TaskEntity[];
  @OneToMany(() => AnnouncementEntity, (announcement) => announcement.teacher, {
    nullable: true,
  })
  announcements: AnnouncementEntity[];
  @OneToMany(()=>SessionTypeEntity,(sessionType)=>sessionType.teacher,{
    nullable:true
  })
  sessionTypes:SessionTypeEntity[]
}
