import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { PresenceEntity } from './entities/presence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { SessionEntity } from '../session/entities/session.entity';
import { SessionTypeEntity } from "../session-type/entities/session-type.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([PresenceEntity, SessionEntity, SessionTypeEntity]),
    SessionModule,
    UserModule,
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
