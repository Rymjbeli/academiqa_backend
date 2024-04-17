import { Module } from '@nestjs/common';
import { CommonChatSessionService } from './common-chat-session.service';
import { CommonChatSessionGateway } from './common-chat-session.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonChatEntity } from './entities/common-chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommonChatEntity])],
  providers: [CommonChatSessionGateway, CommonChatSessionService],
})
export class CommonChatSessionModule {}
