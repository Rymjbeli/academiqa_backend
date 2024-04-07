import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class ChatbotService {
  chatBot = [
    {
      id: 1,
      discussionId: 1,
      prompt: 'What is the capital of France?',
      image: '',
      response: 'The capital of France is Paris.',
    },
    {
      id: 2,
      discussionId: 1,
      prompt: 'What is the capital of Spain?',
      image: '',
      response: 'The capital of Spain is Madrid.',
    },
    {
      id: 3,
      discussionId: 2,
      prompt: 'What is python?',
      image: '',
      response: 'Python is one of the programming languages.',
    },
  ];
  buildDiscussions = () => {
    return this.chatBot.reduce((acc, curr) => {
      const discussion = acc.find((d) => d.id === curr.discussionId);
      if (discussion) {
        discussion.conversationHistory.push({
          id: curr.id,
          prompt: curr.prompt,
          image: curr.image,
          response: curr.response,
        });
      } else {
        acc.push({
          id: curr.discussionId,
          conversationHistory: [
            {
              id: curr.id,
              prompt: curr.prompt,
              image: curr.image,
              response: curr.response,
            },
          ],
        });
      }
      return acc;
    }, []);
  };
  private genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  );

  fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString('base64'),
        mimeType,
      },
    };
  }
  async generateResponse(
    prompt: string,
    imageName: string,
    discussionId: number,
  ): Promise<{ prompt: string; image: string; response: string }> {
    try {
      let image = '';
      const genModel = imageName != '' ? 'gemini-pro-vision' : 'gemini-pro';
      const model = this.genAI.getGenerativeModel({
        model: genModel,
      });
      const discussions = this.buildDiscussions();
      let promptWithHistory;
      if (!discussionId) {
        promptWithHistory = prompt;
      } else {
        promptWithHistory =
          discussions
            .find((discussion) => discussion.id === discussionId)
            .conversationHistory.map((chat) => chat.response)
            .join('\n') +
          '\n' +
          prompt;
      }

      let requestPrompt: any[];
      if (imageName != '') {
        image = `uploads\\` + imageName;
        const imageToRead = this.fileToGenerativePart(image, 'image/png');
        requestPrompt = [promptWithHistory, imageToRead];
      } else {
        requestPrompt = [promptWithHistory];
      }

      const result = await model.generateContent(requestPrompt);
      const response = await result.response;
      discussionId = discussionId ? discussionId : discussions.length + 1;
      this.chatBot.push({
        id: this.chatBot.length + 1,
        discussionId: discussionId,
        prompt: prompt,
        image: imageName,
        response: response.text(),
      });
      return { prompt: prompt, image: imageName, response: response.text() };
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }
}
