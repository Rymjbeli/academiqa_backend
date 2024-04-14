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
      cascade: true,
      eager: true,
    },
  )
  discussionId: number;

  @Column({
    nullable: true,
  })
  image: string;

  @Column()
  prompt: string;

  @Column()
  response: string;

  // @ManyToOne(() => UserEntity, (user) => user.chatbotDisscussions, {
  //   nullable: false,
  //   cascade: true,
  //   eager: true,
  // })
  // user: UserEntity;
}
