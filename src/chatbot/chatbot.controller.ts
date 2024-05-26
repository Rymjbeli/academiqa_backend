import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatbotService } from './chatbot.service';
import { ChatbotDiscussionsEntity } from './Entities/chatbot-discussions.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CurrentUser } from '../decorators/user.decorator';
import { Student } from '../user/entities/student.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = /\.(png|jpeg|jpg|jfif)$/i;
        if (!file.originalname.match(allowedFileTypes)) {
          return cb(
            new HttpException(
              'Only PNG, JPEG, and JPG files are allowed',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  async generateResponse(
    @Body() data: { prompt: string; discussionId: number },
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: Student,
  ): Promise<{ prompt: string; image: string; response: string }> {
    try {
      // const imagePath = image ? image.path : '';
      // const imageName = image ? image.filename : '';
      // const prompt = data.prompt;
      // const discussionId = data.discussionId;
      const { prompt, discussionId } = data;
      return this.chatbotService.generateResponse(
        prompt,
        image,
        +discussionId,
        user,
      );
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async GetAllDiscussions(
    @CurrentUser() user: Student,
  ): Promise<ChatbotDiscussionsEntity[]> {
    return await this.chatbotService.getAllDiscussions(user);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async DeleteDiscussionById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Student,
  ): Promise<void> {
    return await this.chatbotService.deleteDiscussionById(+id, user);
  }
}
