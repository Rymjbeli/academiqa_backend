import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { ChatbotDiscussionsEntity } from './Entities/chatbot-discussions.entity';
import { Repository } from 'typeorm';
import { ChatbotMessagesEntity } from './Entities/chatbot-messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
dotenv.config();
@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(ChatbotDiscussionsEntity)
    private chatbotDiscussionsRepository: Repository<ChatbotDiscussionsEntity>,
    @InjectRepository(ChatbotMessagesEntity)
    private chatbotMessagesRepository: Repository<ChatbotMessagesEntity>,
  ) {}

  private genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  );

  fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString('base64'),
        mimeType,
      },
    };
  }
  async generateResponse(
    prompt: string,
    imagePath: string,
    imageName: string,
    discussionId: number,
  ): Promise<{ prompt: string; image: string; response: string }> {
    try {
      const genModel = imagePath != '' ? 'gemini-pro-vision' : 'gemini-pro';
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
      if (imagePath != '') {
        console.log('imagePath', imagePath);
        const imageToRead = this.fileToGenerativePart(imagePath, 'image/png');
        requestPrompt = [promptWithHistory, imageToRead];
      } else {
        requestPrompt = [promptWithHistory];
      }

      const result = await model.generateContent(requestPrompt);
      const response = result.response;
      await this.createMessage(discussion, prompt, response.text(), imageName);
      return { prompt: prompt, image: imagePath, response: response.text() };
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async getAllDiscussions(): Promise<ChatbotDiscussionsEntity[]> {
    return await this.chatbotDiscussionsRepository.find();
  }
  async deleteDiscussionById(id: number) {
    const discussion = await this.chatbotDiscussionsRepository.findOneBy({
      id,
    });
    console.log(discussion);
    if (!discussion) {
      throw new Error(`Discussion with id ${id} not found`);
    }
    await this.chatbotDiscussionsRepository.softRemove(discussion);
  }
  async getDiscussionById(id: number): Promise<ChatbotDiscussionsEntity> {
    return await this.chatbotDiscussionsRepository.findOneBy({ id });
  }
  async createDiscussion(): Promise<ChatbotDiscussionsEntity> {
    const newDiscussion = this.chatbotDiscussionsRepository.create();
    return await this.chatbotDiscussionsRepository.save(newDiscussion);
  }

  async createMessage(
    discussion: ChatbotDiscussionsEntity,
    prompt: string,
    response: string,
    image: string,
  ): Promise<ChatbotMessagesEntity> {
    if (!discussion) {
      discussion = await this.createDiscussion();
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
