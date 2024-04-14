import { Module } from '@nestjs/common';
import { SessionTypeService } from './session-type.service';
import { SessionTypeController } from './session-type.controller';

@Module({
  controllers: [SessionTypeController],
  providers: [SessionTypeService],
})
export class SessionTypeModule {}
