import { Injectable } from '@nestjs/common';
import { CreateCommonChatDto } from './dto/create-common-chat.dto';
import { UpdateCommonChatDto } from './dto/update-common-chat.dto';

@Injectable()
export class CommonChatService {
  create(createCommonChatDto: CreateCommonChatDto) {
    return 'This action adds a new commonChat';
  }

  findAll() {
    return `This action returns all commonChat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commonChat`;
  }

  update(id: number, updateCommonChatDto: UpdateCommonChatDto) {
    return `This action updates a #${id} commonChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} commonChat`;
  }
}
