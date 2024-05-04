import { Injectable } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { AbsenceEntity } from "./entities/absence.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
  ) {}
  async create(createAbsenceDto: CreateAbsenceDto) {
    const absence = this.absenceRepository.create(createAbsenceDto);
    return this.absenceRepository.save(absence);

  }

  findAll() {
    return `This action returns all absence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} absence`;
  }

  update(id: number, updateAbsenceDto: UpdateAbsenceDto) {
    return `This action updates a #${id} absence`;
  }

  remove(id: number) {
    return `This action removes a #${id} absence`;
  }
}
