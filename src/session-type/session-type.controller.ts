import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SessionTypeService } from './session-type.service';
import { CreateSessionTypeDto } from './dto/create-session-type.dto';
import { UpdateSessionTypeDto } from './dto/update-session-type.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSessionTypeGroupSectorLevelDto } from './dto/create-session-type-group-sector-level.dto';
import { SessionTypeEnum } from '../Enums/session-type.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('session-type')
export class SessionTypeController {
  constructor(private readonly sessionTypeService: SessionTypeService) {}

  @Post('/CreateAll')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.sessionTypeService.createSessionTypes(file);
  }

  @Post('/CreateOne')
  createOne(
    @Body()
    createSessionTypeGroupSectorLevelDto: CreateSessionTypeGroupSectorLevelDto,
  ) {
    return this.sessionTypeService.createOneSessionType(
      createSessionTypeGroupSectorLevelDto,
    );
  }

  @Get()
  findAll() {
    return this.sessionTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionTypeService.findOne(+id);
  }

  @Get('Type/:type')
  findByType(@Param('type') type: SessionTypeEnum) {
    return this.sessionTypeService.findByType(type);
  }

  @Get('GroupSectorLevel/:sectorLevel/:group')
  findByGroupSectorLevel(
    @Param('group') groupNumber: number,
    @Param('sectorLevel') sectorLevel: string,
  ) {
    return this.sessionTypeService.findByGroupSectorLevel(
      sectorLevel,
      groupNumber,
    );
  }

  @Get('SectorLevelSubject/:subject/:sectorLevel')
  findBySubjectSectorLevel(
    @Param('subject') subjectName: string,
    @Param('sectorLevel') sectorLevel: string,
  ) {
    return this.sessionTypeService.findBySubjectSectorLevel(
      subjectName,
      sectorLevel,
    );
  }

  @Get(':subjectId/:groupId')
  findBySubjectGroup(
    @Param('subjectId') subjectId: number,
    @Param('groupId') groupId: number,
  ) {
    return this.sessionTypeService.findByGroupAndSubject(groupId, subjectId);
  }

    @Get('ByTeacher/:teacherID')
    findByTeacher(@Param('teacherID') teacherID: number) {
        return this.sessionTypeService.findByTeacher(teacherID);
    }

    @Get('GroupsByTeacher/:teacherID')
    findGroupsByTeacher(@Param('teacherID') teacherID: number) {
        return this.sessionTypeService.findGroupsByTeacher(teacherID);
    }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionTypeDto: UpdateSessionTypeDto,
  ) {
    return this.sessionTypeService.update(id, updateSessionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionTypeService.remove(id);
  }

  @Get('recover/:id')
  recover(@Param('id', ParseIntPipe) id: number) {
    return this.sessionTypeService.recover(id);
  }
}
