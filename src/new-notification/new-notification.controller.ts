import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewNotificationService } from './new-notification.service';
import { CreateNewNotificationDto } from './dto/create-new-notification.dto';
import { UpdateNewNotificationDto } from './dto/update-new-notification.dto';

@Controller('new-notification')
export class NewNotificationController {
  constructor(private readonly newNotificationService: NewNotificationService) {}

  @Post()
  create(@Body() createNewNotificationDto: CreateNewNotificationDto) {
    return this.newNotificationService.create(createNewNotificationDto);
  }

  @Get()
  findAll() {
    return this.newNotificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newNotificationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewNotificationDto: UpdateNewNotificationDto) {
    return this.newNotificationService.update(+id, updateNewNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newNotificationService.remove(+id);
  }
}
