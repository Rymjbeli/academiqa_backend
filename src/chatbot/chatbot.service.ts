import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { ChatbotDiscussionsEntity } from './Entities/chatbot-discussions.entity';
import { Repository } from 'typeorm';
import { ChatbotMessagesEntity } from './Entities/chatbot-messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { User } from '../user/entities/user.entity';

dotenv.config();
@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(ChatbotDiscussionsEntity)
    private chatbotDiscussionsRepository: Repository<ChatbotDiscussionsEntity>,
    @InjectRepository(ChatbotMessagesEntity)
    private chatbotMessagesRepository: Repository<ChatbotMessagesEntity>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  );

  fileToGenerativePart(image: Express.Multer.File, mimeType: string) {
    const base64Data = Buffer.from(image.buffer).toString('base64');
    return {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
  }

  async generateResponse(
    prompt: string,
    image: Express.Multer.File,
    discussionId: number,
    user: User,
  ): Promise<{ prompt: string; image: string; response: string }> {
    try {
      const genModel = image ? 'gemini-pro-vision' : 'gemini-pro';
      const model = this.genAI.getGenerativeModel({
        model: genModel,
      });
      let promptWithHistory: string;
      let discussion: ChatbotDiscussionsEntity;
      if (!discussionId) {
        promptWithHistory = prompt;
      } else {
        discussion = await this.getDiscussionById(discussionId);

        promptWithHistory =
          discussion.messages
            .map((chat) => `${chat.prompt}\n${chat.response}`)
            .join('\n') +
          '\n' +
          prompt;
      }

      let requestPrompt: any[];
      let imagePath: string;
      if (image) {
        console.log('Image received:', image);
        console.log('Discussion ID:', discussionId);
        console.log('Prompt:', prompt);

        /*const authClient = await this.fileUploadService.authorize();
        const imageId: any = await this.fileUploadService.uploadFile(
          authClient,
          image,
          process.env.CHATBOT_UPLOADS,
        );
        // const imagePath = await this.fileUploadService.downloadFile(authClient, imageId, process.env.CSV_FILES);
        imagePath = 'https://drive.google.com/thumbnail?id=' + imageId.id;*/

        try {
          // Upload image to Azure Blob Storage
          const uploadResult = await this.fileUploadService.uploadFile(
            image,
            'chatbot_uploads',
          );
          imagePath = uploadResult.url;
          console.log('Image uploaded to Azure:', imagePath);

          const imageToRead = this.fileToGenerativePart(image, 'image/png');
          requestPrompt = [promptWithHistory, imageToRead];
        } catch (uploadError) {
          console.error('Error uploading image to Azure:', uploadError);
          throw new Error('Failed to upload image to Azure');
        }
      } else {
        requestPrompt = [promptWithHistory];
      }

      const result = await model.generateContent(requestPrompt);
      const response = result.response;
      await this.createMessage(
        discussion,
        prompt,
        response.text(),
        imagePath,
        user,
      );
      return { prompt: prompt, image: imagePath, response: response.text() };
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async getAllDiscussions(user: User): Promise<ChatbotDiscussionsEntity[]> {
    return await this.chatbotDiscussionsRepository.find({
      where: {
        user: { id: user.id },
      },
    });
  }
  async deleteDiscussionById(id: number, user: User): Promise<void> {
    const discussion = await this.chatbotDiscussionsRepository.findOneBy({
      id,
    });
    console.log(discussion);
    if (!discussion) {
      throw new UnauthorizedException(`Discussion with id ${id} not found`);
    }
    if (discussion.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this discussion',
      );
    } else {
      await this.chatbotDiscussionsRepository.softRemove(discussion);
    }
  }
  async getDiscussionById(id: number): Promise<ChatbotDiscussionsEntity> {
    return await this.chatbotDiscussionsRepository.findOneBy({ id });
  }
  async createDiscussion(user: User): Promise<ChatbotDiscussionsEntity> {
    const newDiscussion = this.chatbotDiscussionsRepository.create();
    newDiscussion.user = user;
    console.log(user);
    return await this.chatbotDiscussionsRepository.save(newDiscussion);
  }

  async createMessage(
    discussion: ChatbotDiscussionsEntity,
    prompt: string,
    response: string,
    image: string,
    user: User,
  ): Promise<ChatbotMessagesEntity> {
    if (!discussion) {
      discussion = await this.createDiscussion(user);
    }
    const newMessage = this.chatbotMessagesRepository.create({
      discussion,
      prompt,
      response,
      image,
    });
    await this.chatbotMessagesRepository.save(newMessage);
    return newMessage;
  }
}
