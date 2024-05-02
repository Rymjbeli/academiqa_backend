import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(receiver: CreateUserDto) {
    try {
      const subject = 'Welcome to AcademIQa';
      const content = this.createMailContent(receiver);
      await this.mailerService.sendMail({
        to: receiver.email,
        subject: subject,
        html: content,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  createMailContent(user: CreateUserDto) {
    return `<p>Dear ${user.username},</p>
    <p>Welcome to our platform AcademIQa. We are glad to have you with us. You can now log in to your account with the following credentials:</p>
    <p> <strong> Email: ${user.email}</strong></p>
    <p> <strong> Password: ${user.password}</strong></p>
    <p>Best regards,</p>`;
  }
}
