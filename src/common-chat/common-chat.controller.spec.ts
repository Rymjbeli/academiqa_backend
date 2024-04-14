import { Test, TestingModule } from '@nestjs/testing';
import { CommonChatController } from './common-chat.controller';
import { CommonChatService } from './common-chat.service';

describe('CommonChatController', () => {
  let controller: CommonChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonChatController],
      providers: [CommonChatService],
    }).compile();

    controller = module.get<CommonChatController>(CommonChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
