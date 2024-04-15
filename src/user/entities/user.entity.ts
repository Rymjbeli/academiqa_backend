import { TimestampEntites } from '../../Generics/timestamp.entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { UserRoleEnum } from '../../Enums/user-role.enum';
@Entity('user')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class UserEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  username: string;
  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.STUDENT,
  })
  role: string;
}
