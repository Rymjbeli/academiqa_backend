import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionTypeService } from './session-type.service';
import { CreateSessionTypeDto } from './dto/create-session-type.dto';
import { UpdateSessionTypeDto } from './dto/update-session-type.dto';

@Controller('session-type')
export class SessionTypeController {
  constructor(private readonly sessionTypeService: SessionTypeService) {}

  @Post()
  create(@Body() createSessionTypeDto: CreateSessionTypeDto) {
    return this.sessionTypeService.create(createSessionTypeDto);
  }

  @Get()
  findAll() {
    return this.sessionTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSessionTypeDto: UpdateSessionTypeDto,
  ) {
    return this.sessionTypeService.update(+id, updateSessionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionTypeService.remove(+id);
  }
}
