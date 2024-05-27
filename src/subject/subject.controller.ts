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
  UseGuards,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Teacher } from '../user/entities/teacher.entity';

@Controller('subject')
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('/CreateAll')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return await this.subjectService.createSubjects(file);
  }
  @Post('CreateOne')
  async createOne(@Body() createSubjectDto: CreateSubjectDto) {
    //console.log('createSubjectDto', createSubjectDto);
    return await this.subjectService.createOneSubject(createSubjectDto);
  }

  @Get()
  async findAll() {
    return await this.subjectService.findAll();
  }
  @Get('/GroupedByModule')
  async findAllGroupedByModule() {
    return await this.subjectService.findAllGroupedByModule();
  }
  @Get('/SectorLevel/:sectorLevel')
  async findBySectorLevel(@Param('sectorLevel') sectorLevel: string) {
    return await this.subjectService.findBySectorLevel(sectorLevel);
  }
  @Get('/teacher')
  async findByTeacher(@CurrentUser() user: Teacher) {
    return await this.subjectService.findByTeacher(user);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subjectService.findOne(+id);
  }

  @Get('/NameSectorLevel/:name/:sectorLevel')
  findBySubjectName(
    @Param('name') name: string,
    @Param('sectorLevel') sectorLevel: string,
  ) {
    return this.subjectService.findBySubjectName(name, sectorLevel);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.subjectService.deleteSubject(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return await this.subjectService.update(+id, updateSubjectDto);
  }
}
