import { Module } from '@nestjs/common';
import { CommonChatService } from './common-chat.service';
import { CommonChatController } from './common-chat.controller';

@Module({
  controllers: [CommonChatController],
  providers: [CommonChatService],
})
export class CommonChatModule {}
