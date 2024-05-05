import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetGroupDto } from '../group/dto/get-group.dto';
import { AddSessionDto } from './dto/add-session.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async generateSessionsForAllSessionTypes(
    @Query('numberOfWeeks') numberOfWeeks: number,
    @Query('semesterStartDate') semesterStartDate: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sessionService.generateSessionsForAllSessionTypes(
      numberOfWeeks,
      semesterStartDate,
      file,
    );
  }

  @Post('addSession')
  addSession(
    @Body('addSessionDto') addSessionDto: AddSessionDto,
    @Body('getGroupDto') getGroupDto: GetGroupDto,
  ) {
    return this.sessionService.addSession(addSessionDto, getGroupDto);
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get('holiday/:date')
  findOne(@Param('date') date: Date) {
    return this.sessionService.findOneHoliday(date);
  }

  // get by gl3/2
  @Get('OfSectorLevelGroup/:sector/:level/:group')
  findBySectorLevelGroup(@Param() getGroupDto: GetGroupDto) {
    return this.sessionService.findSessionsOfSectorLevelGroup(getGroupDto);
  }

  @Delete('deleteDuplicate')
  removeDuplicate() {
    return this.sessionService.deleteDuplicateHolidaySessions();
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.sessionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionService.remove(id);
  }

  @Get('recover/:id')
  recover(@Param('id', ParseIntPipe) id: number) {
    return this.sessionService.recover(id);
  }

  @Get('ByTeacher/:teacherID')
  findByTeacher(@Param('teacherID') teacherID: number) {
    return this.sessionService.findByTeacher(teacherID);
  }
}
