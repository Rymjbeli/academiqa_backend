import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommonChatService } from './common-chat.service';
import { CreateCommonChatDto } from './dto/create-common-chat.dto';
import { UpdateCommonChatDto } from './dto/update-common-chat.dto';

@Controller('common-chat')
export class CommonChatController {
  constructor(private readonly commonChatService: CommonChatService) {}

  @Post()
  create(@Body() createCommonChatDto: CreateCommonChatDto) {
    return this.commonChatService.create(createCommonChatDto);
  }

  @Get()
  findAll() {
    return this.commonChatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonChatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommonChatDto: UpdateCommonChatDto) {
    return this.commonChatService.update(+id, updateCommonChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonChatService.remove(+id);
  }
}
