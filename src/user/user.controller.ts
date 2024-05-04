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
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOneUser(id);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.softDeleteUser(id);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.restoreUser(id);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Body('newPassword') newPassword: string,
    @Body('oldPassword') oldPassword: string,
  ) {
    return await this.userService.changePassword(
      user,
      oldPassword,
      newPassword,
    );
  }

  @Patch('edit-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      fileFilter: (req, file, e) => {
        const allowedFileTypes = /\.(png|jpeg|jpg)$/i;
        if (!file.originalname.match(allowedFileTypes)) {
          return e(
            new HttpException(
              'Only PNG, JPEG, and JPG files are allowed',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        e(null, true);
      },
    }),
  )
  async editPhoto(
    @CurrentUser() user: User,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.userService.editPhoto(user, photo);
  }
}
