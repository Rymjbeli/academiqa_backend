import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';

@Entity('session')
export class SessionEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => SessionTypeEntity, (sessionType) => sessionType.sessions, {
    nullable: false,
  })
  sessionType: SessionTypeEntity;
}
