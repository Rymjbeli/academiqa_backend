import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotDiscussionsEntity } from './Entities/chatbot-discussions.entity';
import { ChatbotMessagesEntity } from './Entities/chatbot-messages.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileUploadModule } from '../file-upload/file-upload.module'; // Correct import path

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatbotDiscussionsEntity, ChatbotMessagesEntity]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
