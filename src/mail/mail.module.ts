import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import {MailerModule} from "@nestjs-modules/mailer";
import {mailerConfig} from "../config/mailer.config";

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [MailerModule.forRoot(mailerConfig)],
  exports: [MailerModule],
})
export class MailModule {}
