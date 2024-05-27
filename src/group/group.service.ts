import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetGroupDto } from './dto/get-group.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
  ) {}
  async createOneGroup(createGroupDto: CreateGroupDto) {
    const group = this.groupRepository.create(createGroupDto);
    return await this.groupRepository.save(group);
  }

  async createGroups(groupFile: Express.Multer.File) {
    const groups: CreateGroupDto[] =
      await this.fileUploadService.uploadCSVFile(groupFile);
    //console.log('groups', groups);
    const groupEntities = groups.map((createGroupDto) =>
      this.createOneGroup(createGroupDto),
    );
    return Promise.all(groupEntities);
  }

  async findAll() {
    return await this.groupRepository.find();
  }

  async findBySectorLevel(sectorLevel: string) {
    return await this.groupRepository.find({ where: { sectorLevel } });
  }

  async findByLevel(level: string) {
    return await this.groupRepository.find({ where: { level } });
  }

  async findBySector(sector: string) {
    return await this.groupRepository.find({ where: { sector } });
  }

  async findBySectorGroupLevel(getGroupDto: GetGroupDto) {
    const group = await this.groupRepository.findOne({
      where: {
        sector: getGroupDto.sector,
        level: getGroupDto.level,
        group: getGroupDto.group,
      },
    });
    if (!group) {
      throw new Error('Group not found');
    }
    return group;
  }

  async findBySectorLevelGroup(
    sectorLevel: string,
    group: number,
  ): Promise<GroupEntity> {
    const foundGroup = await this.groupRepository.findOneBy({
      sectorLevel,
      group,
    });
    if (!foundGroup) {
      throw new Error('Group not found ' + sectorLevel + ' ' + group);
    }
    return foundGroup;
  }

  async findAllGroupedBySectorLevel() {
    const groups = await this.findAll();

    const groupedGroups = groups.reduce((grouped, group) => {
      const key = group.sectorLevel;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(group);
      return grouped;
    }, {});

    return Object.keys(groupedGroups).map((sectorLevel) => ({
      sectorLevel,
      groups: groupedGroups[sectorLevel],
    }));
  }

  async findOne(id: number) {
    return await this.groupRepository.findOneBy({ id });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne(id);
    if (!group) {
      throw new Error('Group not found');
    } else {
      return await this.groupRepository.save({ ...group, ...updateGroupDto });
    }
  }

  async remove(id: number) {
    const group = await this.findOne(id);
    if (!group) {
      throw new Error('Group not found');
    } else {
      return await this.groupRepository.softRemove(group);
    }
  }

  async recover(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!group) {
      throw new Error('Group not found');
    } else {
      return await this.groupRepository.recover(group);
    }
  }

  async countGroups() {
    return await this.groupRepository.count();
  }
}
