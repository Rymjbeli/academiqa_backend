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


@Controller('session-type')
export class SessionTypeController {
  constructor(private readonly sessionTypeService: SessionTypeService) {}

  @Post('/CreateAll')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.sessionTypeService.createSessionTypes(file);
  }

  @Post('/CreateOne')
  @UseGuards(JwtAuthGuard)
  createOne(
    @Body()
    createSessionTypeGroupSectorLevelDto: CreateSessionTypeGroupSectorLevelDto,
  ) {
    return this.sessionTypeService.createOneSessionType(
      createSessionTypeGroupSectorLevelDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.sessionTypeService.findAll();
  }
  @Get('GroupsByTeacher/:id')
  @UseGuards(JwtAuthGuard)
  async findGroupsByTeacher(@Param('id',ParseIntPipe) id: number) {
    console.log('teacherID', id);
    return await this.sessionTypeService.findGroupsByTeacher(+id);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.sessionTypeService.findOne(+id);
  }

  @Get('Type/:type')
  @UseGuards(JwtAuthGuard)
  findByType(@Param('type') type: SessionTypeEnum) {
    return this.sessionTypeService.findByType(type);
  }

  @Get('GroupSectorLevel/:sectorLevel/:group')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  findBySubjectGroup(
    @Param('subjectId') subjectId: number,
    @Param('groupId') groupId: number,
  ) {
    return this.sessionTypeService.findByGroupAndSubject(groupId, subjectId);
  }

  @Get('ByTeacher/:teacherID')
  @UseGuards(JwtAuthGuard)
  findByTeacher(@Param('teacherID') teacherID: number) {
    return this.sessionTypeService.findByTeacher(teacherID);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionTypeDto: UpdateSessionTypeDto,
  ) {
    return this.sessionTypeService.update(id, updateSessionTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionTypeService.remove(id);
  }

  @Get('recover/:id')
  @UseGuards(JwtAuthGuard)
  recover(@Param('id', ParseIntPipe) id: number) {
    return this.sessionTypeService.recover(id);
  }

  @Get('bySession/:id')
  @UseGuards(JwtAuthGuard)
  findBySession(@Param('id', ParseIntPipe) id: number) {
    return this.sessionTypeService.findBySession(id);
  }
}
