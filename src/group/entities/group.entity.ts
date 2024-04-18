import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';

@Entity('groups')
export class GroupEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  sector: string;
  @Column()
  level: string;
  @Column()
  group: number;
  @Column()
  sectorLevel: string;
}
