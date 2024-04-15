import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';

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
  sector: string;

  @Column()
  level: number;

  @Column({
    length: 100,
  })
  sectorLevel: string;

  @Column()
  hourlyLoad: number;

  @Column()
  absenceLimit: number;

  @OneToMany(() => SessionTypeEntity, (sessionType) => sessionType.subject)
  sessionTypes: SessionTypeEntity[];
}
