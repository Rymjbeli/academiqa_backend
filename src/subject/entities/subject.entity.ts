import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';
import { AnnouncementEntity } from '../../announcement/entities/announcement.entity';
import { Teacher } from '../../user/entities/teacher.entity';
import { AbsenceEntity } from '../../absence/entities/absence.entity';
import { IsIn } from 'class-validator';

@Entity('subject')
export class SubjectEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 100,
  })
  sectorLevel: string;
  @Column()
  module: string;
  @Column({
    type: 'float',
  })
  coefficient: number;
  @Column()
  hourlyLoad: number;
  @Column()
  absenceLimit: number;

  @Column()
  @IsIn([1, 2])
  semester: number;

  @OneToMany(() => SessionTypeEntity, (sessionType) => sessionType.subject)
  sessionTypes: SessionTypeEntity[];
  @OneToMany(() => AnnouncementEntity, (announcement) => announcement.subject, {
   nullable: true,
   cascade: ['soft-remove']
  })
  announcements: AnnouncementEntity[];

  // @OneToMany(() => AbsenceEntity, (absence) => absence.subject, {
  //   nullable: true,
  //  cascade: ['soft-remove']
  // })
  // absences: AbsenceEntity[];
}
