import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotDiscussionsEntity } from './Entities/chatbot-discussions.entity';
import { ChatbotMessagesEntity } from './Entities/chatbot-messages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatbotDiscussionsEntity, ChatbotMessagesEntity]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
