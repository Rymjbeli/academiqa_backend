import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('send')
  async sendMail(@Body() receiver: CreateUserDto) {
    const emailSent = await this.mailService.sendEmail(receiver);

    if (emailSent) {
      return { message: 'Email sent successfully' };
    } else {
      return { message: 'Error sending email' };
    }
  }
}
