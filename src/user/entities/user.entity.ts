import { TimestampEntites } from '../../Generics/timestamp.entities';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from '../../Enums/user-role.enum';
import { ChatbotDiscussionsEntity } from '../../chatbot/Entities/chatbot-discussions.entity';

@Entity('user')
@TableInheritance({
  column: { type: 'varchar', name: 'role', enum: UserRoleEnum },
})
export class User extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ unique: true })
  cin: number;

  @Column({ nullable: true, length: 500 })
  Photo: string;

  @Exclude()
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
