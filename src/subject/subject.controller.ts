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
  async createOne(@Body() createSubjectDto: CreateSubjectDto) {
    console.log('createSubjectDto', createSubjectDto);
    return await this.subjectService.createOneSubject(createSubjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.subjectService.findAll();
  }
  @Get('/GroupedByModule')
  @UseGuards(JwtAuthGuard)
  async findAllGroupedByModule() {
    return await this.subjectService.findAllGroupedByModule();
  }
  @Get('/SectorLevel/:sectorLevel')
  @UseGuards(JwtAuthGuard)
  async findBySectorLevel(@Param('sectorLevel') sectorLevel: string) {
    return await this.subjectService.findBySectorLevel(sectorLevel);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.subjectService.findOne(+id);
  }
  // @Get('/teacher')
  // async findByTeacher() {
  //   return await this.subjectService.findByTeacher();
  // }


  @Get('/NameSectorLevel/:name/:sectorLevel')
  findBySubjectName(
    @Param('name') name: string,
    @Param('sectorLevel') sectorLevel: string,
  ) {
    return this.subjectService.findBySubjectName(name, sectorLevel);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.subjectService.deleteSubject(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return await this.subjectService.update(+id, updateSubjectDto);
  }
}
