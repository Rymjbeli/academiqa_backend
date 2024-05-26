import { Injectable } from '@nestjs/common';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { PresenceEntity } from "./entities/presence.entity";
import { Repository } from "typeorm";
import { Student } from "../user/entities/student.entity";

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(PresenceEntity) private readonly presenceRepository: Repository<PresenceEntity>
  ){
  }
  async findPresence(createPresenceDto: CreatePresenceDto) {
    const {session, student} = createPresenceDto;
    return await this.presenceRepository.findOne({
      where: {
        session,
        student
      }
    });
  }
  async delete(id: number) {
    return await this.presenceRepository.delete(id);
  }
  async create(createPresenceDto: CreatePresenceDto) {
    const newPresence = this.presenceRepository.create(createPresenceDto);
    return await this.presenceRepository.save(newPresence);
  }
}
