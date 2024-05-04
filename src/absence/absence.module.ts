import { Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AbsenceEntity } from "./entities/absence.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AbsenceEntity])],
  controllers: [AbsenceController],
  providers: [AbsenceService],
})
export class AbsenceModule {}
