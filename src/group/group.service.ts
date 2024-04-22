import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepository: Repository<GroupEntity>,
  ) {}
  create(createGroupDto: CreateGroupDto) {
    return 'This action adds a new group';
  }

  async getGroupBySLNum(sectorLevel: string, groupNumber: number){
    const group = await this.groupRepository.findOne({
      where: { sectorLevel: sectorLevel, group: groupNumber },
    });
    if (!group) {
      return null;
    }
    return group;
  }

  findAll() {
    return `This action returns all group`;
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
