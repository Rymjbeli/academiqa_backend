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
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('/CreateAll')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return await this.subjectService.createSubjects(file);
  }
  @Post('CreateOne')
  createOne(@Body() createSubjectDto: CreateSubjectDto) {
    console.log("createSubjectDto", createSubjectDto);
    return this.subjectService.createOneSubject(createSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }
  @Get('/GroupedByModule')
  findAllGroupedByModule() {
    return this.subjectService.findAllGroupedByModule();
  }
  @Get('/SectorLevel/:sectorLevel')
  findOneBySectorLevel(@Param('sectorLevel') sectorLevel: string) {
    return this.subjectService.findBySectorLevel(sectorLevel);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(+id);
  }
  // @Get('/teacher')
  // async findByTeacher() {
  //   return await this.subjectService.findByTeacher();
  // }

  @Get('/Name/:name')
  findBySubjectName(@Param('name') name: string) {
    return this.subjectService.findBySubjectName(name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectService.deleteSubject(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(+id, updateSubjectDto);
  }
}
