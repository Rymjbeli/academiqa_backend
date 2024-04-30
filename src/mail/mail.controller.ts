import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('send')
  async sendMail(
    @Body() mailData: { receiver: string; subject: string; content: string },
  ) {
    const { receiver, subject, content } = mailData;
    const emailSent = await this.mailService.sendEmail(
      receiver,
      subject,
      content,
    );

    if (emailSent) {
      return { message: 'Email sent successfully' };
    } else {
      return { message: 'Error sending email' };
    }
  }
}
