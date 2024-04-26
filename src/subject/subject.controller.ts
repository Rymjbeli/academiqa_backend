import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, UseGuards
} from "@nestjs/common";
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('/CreateAll')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return await this.subjectService.createSubjects(file);
  }
  @Post('CreateOne')
  @UseGuards(JwtAuthGuard)
  createOne(@Body() createSubjectDto: CreateSubjectDto) {
    console.log('createSubjectDto', createSubjectDto);
    return this.subjectService.createOneSubject(createSubjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.subjectService.findAll();
  }
  @Get('/GroupedByModule')
  @UseGuards(JwtAuthGuard)
  findAllGroupedByModule() {
    return this.subjectService.findAllGroupedByModule();
  }
  @Get('/SectorLevel/:sectorLevel')
  @UseGuards(JwtAuthGuard)
  findBySectorLevel(@Param('sectorLevel') sectorLevel: string) {
    return this.subjectService.findBySectorLevel(sectorLevel);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.subjectService.deleteSubject(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(+id, updateSubjectDto);
  }
}
