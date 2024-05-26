import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { PresenceEntity } from "./entities/presence.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionModule } from "../session/session.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([PresenceEntity])],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
