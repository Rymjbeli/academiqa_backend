import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { ChatbotDiscussionsEntity } from './chatbot-discussions.entity';

@Entity('chatbot_messages')
export class ChatbotMessagesEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ChatbotDiscussionsEntity,
    (chatbotDiscussions) => chatbotDiscussions.id,
    {
      nullable: false,
    },
  )
  discussion: ChatbotDiscussionsEntity;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    type: 'mediumtext',
  })
  prompt: string;

  @Column({
    type: 'mediumtext',
  })
  response: string;
}
