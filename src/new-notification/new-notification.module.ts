import { Global, Module } from "@nestjs/common";
import { NewNotificationService } from './new-notification.service';
import { NewNotificationController } from './new-notification.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewNotificationEntity } from "./entities/new-notification.entity";
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([NewNotificationEntity])],
  controllers: [NewNotificationController],
  providers: [NewNotificationService],
})
export class NewNotificationModule {}
