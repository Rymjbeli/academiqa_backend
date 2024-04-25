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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GroupEntity } from './entities/group.entity';
import { GetGroupDto } from './dto/get-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/CreateAll')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return await this.groupService.createGroups(file);
  }

  @Post('/CreateOne')
  createOne(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createOneGroup(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }
  @Get('count')
  // @UseGuards(JwtAuthGuard)
  async countGroups() {
    return await this.groupService.countGroups();
  }
  @Get('/SectorLevel/:sectorLevel')
  findBySectorLevel(@Param('sectorLevel') sectorLevel: string) {
    return this.groupService.findBySectorLevel(sectorLevel);
  }

  @Get('/Level/:level')
  findByLevel(@Param('level') level: string) {
    return this.groupService.findByLevel(level);
  }

  @Get('/Sector/:sector')
  findBySector(@Param('sector') sector: string) {
    return this.groupService.findBySector(sector);
  }

  @Get('/SectorGroupLevel/:sector/:level/:group')
  findBySectorGroupLevel(@Param() getGroupDto: GetGroupDto) {
    return this.groupService.findBySectorGroupLevel(getGroupDto);
  }

  @Get('/SectorLevelGroup/:sectorLevel/:group')
  findGroupedBySectorLevelGroup(
    @Param('sectorLevel') sectorLevel: string,
    @Param('group', ParseIntPipe) group: number,
  ): Promise<GroupEntity> {
    return this.groupService.findBySectorLevelGroup(sectorLevel, group);
  }

  @Get('/GroupedBySectorLevel')
  findAllGroupedBySectorLevel() {
    return this.groupService.findAllGroupedBySectorLevel();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Patch('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.remove(id);
  }

  @Get('/recover/:id')
  recover(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.recover(id);
  }
}
