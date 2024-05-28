import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { SessionEntity } from '../../session/entities/session.entity';
@Entity('ressource')
export class RessourceEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SessionEntity, (session) => session.ressources, {
    nullable: false,
  })
  session: number;

  @Column()
  type: string;

  @Column({
    nullable: true,
  })
  link: string;

  @Column({
    nullable: true,
  })
  fileUrl: string;
}
