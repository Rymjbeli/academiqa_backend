import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ChatbotService } from './chatbot.service';
import { ChatbotDiscussionsEntity } from './Entities/chatbot-discussions.entity';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  async generateResponse(
    @Body() data: { prompt: string; discussionId: number },
    @UploadedFile() image: Express.Multer.File,
  ): Promise<{ prompt: string; image: string; response: string }> {
    try {
      const imagePath = image ? image.path : '';
      const imageName = image ? image.filename : '';
      const prompt = data.prompt;
      const discussionId = data.discussionId;
      // discussionId = parseInt(String(discussionId));

      return this.chatbotService.generateResponse(
        prompt,
        imagePath,
        imageName,
        +discussionId,
      );
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  @Get('GetAllDiscussions')
  async GetAllDiscussions(): Promise<ChatbotDiscussionsEntity[]> {
    return await this.chatbotService.getAllDiscussions();
  }
  @Delete('DeleteDiscussion/:id')
  async DeleteDiscussionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    console.log(id);
    return await this.chatbotService.deleteDiscussionById(+id);
  }
}
