import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { AdminService } from './admin.service';
import { Admin } from '../entities/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  async findAllAdmins() {
    return await this.adminService.findAllAdmins();
  }

  @Get('count')
  // @UseGuards(JwtAuthGuard)
  async countAdmins() {
    return await this.adminService.countAdmins();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.findOneAdmin(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Admin>,
  ) {
    return await this.adminService.updateAdmin(id, data);
  }
}
