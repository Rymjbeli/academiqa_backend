import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { ChatbotMessagesEntity } from './chatbot-messages.entity';

@Entity('chatbot_discussions')
export class ChatbotDiscussionsEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => ChatbotMessagesEntity,
    (chatbotMessages) => chatbotMessages.discussionId,
    {
      nullable: true,
      cascade: true,
      eager: true,
    },
  )
  messages: ChatbotMessagesEntity[];
}
