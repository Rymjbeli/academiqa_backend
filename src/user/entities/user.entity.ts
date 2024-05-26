import { TimestampEntites } from '../../Generics/timestamp.entities';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { UserRoleEnum } from '../../Enums/user-role.enum';
import { ChatbotDiscussionsEntity } from '../../chatbot/Entities/chatbot-discussions.entity';
import { Min, MinLength } from 'class-validator';

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

  @Column({ unique: true })
  cin: number;

  @Column({ nullable: true, length: 500 })
  photo: string;

  @Column()
  salt: string;

  @Column()
  role: string;

  @OneToMany(
    () => ChatbotDiscussionsEntity,
    (chatbotDiscussions) => chatbotDiscussions.user,
    {
      nullable: true,
      cascade: ['soft-remove'],
    },
  )
  chatbotDiscussions: ChatbotDiscussionsEntity[];
}
