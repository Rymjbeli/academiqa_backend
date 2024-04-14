import { Test, TestingModule } from '@nestjs/testing';
import { CommonChatService } from './common-chat.service';

describe('CommonChatService', () => {
  let service: CommonChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonChatService],
    }).compile();

    service = module.get<CommonChatService>(CommonChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
