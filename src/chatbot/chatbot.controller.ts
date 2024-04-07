import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ChatbotService } from './chatbot.service';


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
      const imagePath = image ? image.filename : '';
      const prompt = data.prompt;
      let discussionId = data.discussionId;
      discussionId = parseInt(String(discussionId));

      return this.chatbotService.generateResponse(
        prompt,
        imagePath,
        discussionId,
      );
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  @Get('GetAllDiscussions')
  GetAllDiscussions(): any[] {
    return this.chatbotService.buildDiscussions();
  }
}
