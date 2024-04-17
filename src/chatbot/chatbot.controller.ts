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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatbotService } from './chatbot.service';
import { ChatbotDiscussionsEntity } from './Entities/chatbot-discussions.entity';
import { FileUploadService } from '../file-upload/file-upload.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = /\.(png|jpeg|jpg)$/i;
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
  async generateResponse(
    @Body() data: { prompt: string; discussionId: number },
    @UploadedFile() image: Express.Multer.File,
  ): Promise<{ prompt: string; image: string; response: string }> {
    try {
      // const imagePath = image ? image.path : '';
      // const imageName = image ? image.filename : '';
      // const prompt = data.prompt;
      // const discussionId = data.discussionId;
      const { prompt, discussionId } = data;
      return this.chatbotService.generateResponse(prompt, image, +discussionId);
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

  // @Post('upload-file')
  // @UseInterceptors(
  //   FileInterceptor('image')
  // )
  // async uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<any> {
  //   try {
  //     const authClient = await this.fileUploadService.authorize();
  //     return await this.fileUploadService.uploadFile(authClient, file, process.env.CSV_FILES)
  //   } catch (error) {
  //     throw new Error(`Failed to upload file: ${error.message}`);
  //   }
  // }
}
