import { TimestampEntites } from '../../Generics/timestamp.entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from '../../Enums/user-role.enum';

@Entity('user')
@TableInheritance({
  column: { type: 'varchar', name: 'role', enum: UserRoleEnum },
})
export class User extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  salt: string;

  @Column()
  role: string;
}
