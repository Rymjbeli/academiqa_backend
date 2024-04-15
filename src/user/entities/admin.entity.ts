import { ChildEntity } from 'typeorm';
import { UserEntity } from './user.entity';
@ChildEntity()
export class AdminEntity extends UserEntity {}
