import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PresenceService } from './presence.service';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SessionGuard } from '../session/guard/session.guard';

@Controller('presence')
@UseGuards(JwtAuthGuard)
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  async create(@Body() createPresenceDto: CreatePresenceDto) {
    const presence = await this.presenceService.findPresence(createPresenceDto);
    if (presence) {
      throw new BadRequestException('Presence already exists');
    }
    return this.presenceService.create(createPresenceDto);
  }

  @Delete()
  async delete(@Body() createPresenceDto: CreatePresenceDto) {
    const presence = await this.presenceService.findPresence(createPresenceDto);
    if (!presence) {
      throw new NotFoundException('Presence not found');
    }
    return this.presenceService.delete(presence.id);
  }

  @Get('sectorsAbsence')
  async getSectorsAbsence() {
    return this.presenceService.getSectorsAbsence();
  }
  @Get('sectorAvrageAbsence')
  async getAverageAbsencePercentage(): Promise<number> {
    return this.presenceService.getAverageAbsence();
  }
  // @Get('studentsAbsence/:id')
  // async getStudentsAbsence(@Param('id', ParseIntPipe) id: number) {
  //   return this.presenceService.getStudentSubjectAbsences(+id);
  // }

  @Get('studentsAbsence/:id')
  async getAbsencesForOneStudent(@Param('id', ParseIntPipe) id: number) {
    return this.presenceService.getAbsencesForOneStudent(+id);
  }
  // @Get('studentsAbsenceAndCourses/:id')
  // async getAbsencesAndCoursesForAdmin(@Param('id', ParseIntPipe) id: number) {
  //   return this.presenceService.getAbsencesAndCoursesForAdmin(+id);
  // }
  @Get('monthlyAbsence/:id')
  async getSectorMonthlyAbsence(@Param('id', ParseIntPipe) id: number) {
    return await this.presenceService.getSectorMonthlyAbsence(+id);
  }
}
