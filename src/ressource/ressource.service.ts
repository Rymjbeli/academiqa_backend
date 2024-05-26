import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RessourceEntity } from './entities/ressource.entity';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserRoleEnum } from 'src/Enums/user-role.enum';
import { SessionTypeService } from 'src/session-type/session-type.service';

@Injectable()
export class RessourceService {
  constructor(
    @InjectRepository(RessourceEntity)
    private ressourceRepository: Repository<RessourceEntity>,
    private sessionTypeService: SessionTypeService,
  ) {}

  async create(
    createRessourceDto: CreateRessourceDto,
    user: User,
    file: Express.Multer.File,
  ) {
    if (user.role != UserRoleEnum.TEACHER)
      throw new HttpException('You are not a teacher', HttpStatus.FORBIDDEN);
    const sessionType = await this.sessionTypeService.findBySession(
      createRessourceDto.session.id,
    );
    if (sessionType[0].teacher.id != user.id)
      throw new HttpException(
        `You are not the teacher of this session: your id is ${user.id} and the owner's id is ${sessionType[0].teacher.id}`,
        HttpStatus.FORBIDDEN,
      );
    return await this.ressourceRepository.save(createRessourceDto);
  }

  async findAll() {
    return await this.ressourceRepository.find({
      relations: ['session'],
    });
  }

  async remove(id: number) {
    return await this.ressourceRepository.softRemove({ id });
  }

  async recover(id: number) {
    return await this.ressourceRepository.recover({ id });
  }
}
