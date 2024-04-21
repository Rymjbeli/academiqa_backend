import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {User} from "./entities/user.entity";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOneUser(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.softDeleteUser(id);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.restoreUser(id);
  }
}
