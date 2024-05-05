import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RessourceService } from './ressource.service';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ressource')
export class RessourceController {
  constructor(private readonly ressourceService: RessourceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create( @Body() createRessourceDto: CreateRessourceDto,     
          @CurrentUser()user:User,
          @UploadedFile() file: Express.Multer.File
         ){
    return this.ressourceService.create(createRessourceDto, user, file);
  }

  @Get()
  findAll() {
    return this.ressourceService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ressourceService.remove(+id);
  }

  @Get('recover/:id')
  recover(@Param('id') id: string) {
    return this.ressourceService.recover(+id);
  }
}
