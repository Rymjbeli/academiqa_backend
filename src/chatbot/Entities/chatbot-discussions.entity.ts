import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { ChatbotMessagesEntity } from './chatbot-messages.entity';
import { Student } from '../../user/entities/student.entity';
import { User } from '../../user/entities/user.entity';

@Entity('chatbot_discussions')
export class ChatbotDiscussionsEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => ChatbotMessagesEntity,
    (chatbotMessages) => chatbotMessages.discussion,
    {
      nullable: true,
      eager: true,
      cascade: ['soft-remove'],
    },
  )
  messages: ChatbotMessagesEntity[];
  @ManyToOne(() => User, (user) => user.chatbotDiscussions, {
    nullable: false,
  })
  user: User;
}
