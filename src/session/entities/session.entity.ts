import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionType } from '../../session-type/entities/session-type.entity';

@Entity('session')
export class Session extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => SessionType, (sessionType) => sessionType.sessions)
  sessionType: SessionType;
}
