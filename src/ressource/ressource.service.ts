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
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Readable } from 'stream';

@Injectable()
export class RessourceService {
  private containerClient;

  constructor(
      @InjectRepository(RessourceEntity) private ressourceRepository: Repository<RessourceEntity>,
      private sessionTypeService: SessionTypeService
  ) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    this.containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
  }

  async create(createRessourceDto: CreateRessourceDto, user: User, file: Express.Multer.File) {
    if (user.role != UserRoleEnum.TEACHER) {
      throw new HttpException('You are not a teacher', HttpStatus.FORBIDDEN);
    }
    //console.log(createRessourceDto.session, user.id);
    const sessionType = await this.sessionTypeService.findBySession(createRessourceDto.session);
    if (sessionType[0].teacher.id != user.id) {
      throw new HttpException(`You are not the teacher of this session: your id is ${user.id} and the owner's id is ${sessionType[0].teacher.id}`, HttpStatus.FORBIDDEN);
    }

    // Upload file to Azure Blob Storage
    const fileUploadResponse = await this.uploadFile(file, 'resources');

    // Save the resource entity with the uploaded file URL
    createRessourceDto.fileUrl = fileUploadResponse.url;
    createRessourceDto.type = 'file';
    createRessourceDto.link = null;
    return await this.ressourceRepository.save(createRessourceDto);
  }

  async uploadFile(image: Express.Multer.File, folderPath: string): Promise<any> {
    try {
      const blobName = `${folderPath}/${Date.now()}-${image.originalname}`;
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      const fileStream = new Readable();
      fileStream.push(image.buffer);
      fileStream.push(null);

      const uploadResponse = await blockBlobClient.uploadStream(
          fileStream,
          image.buffer.length,
          undefined,
          {
            onProgress: (ev) => console.log('Progress:', ev.loadedBytes),
          },
      );

      return {
        url: blockBlobClient.url,
        uploadResponse,
      };
    } catch (error) {
      console.error('Error occurred during file upload:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async addLink(createRessourceDto: CreateRessourceDto, user: User) {
    //console.log("createRessourceDto", createRessourceDto);

    if (user.role != UserRoleEnum.TEACHER) {
      throw new HttpException('You are not a teacher', HttpStatus.FORBIDDEN);
    }

    const sessionType = await this.sessionTypeService.findBySession(createRessourceDto.session);
    if (sessionType[0].teacher.id != user.id) {
      throw new HttpException(`You are not the teacher of this session: your id is ${user.id} and the owner's id is ${sessionType[0].teacher.id}`, HttpStatus.FORBIDDEN);
    }

    createRessourceDto.type = 'link';
    createRessourceDto.fileUrl = null;
    //console.log("Modified createRessourceDto:", createRessourceDto);

    // Ensure `link` is set
    if (!createRessourceDto.link) {
      throw new HttpException('Link must be provided', HttpStatus.BAD_REQUEST);
    }

    const savedResource = await this.ressourceRepository.save(createRessourceDto);
    //console.log("Saved Resource:", savedResource);

    return savedResource;
  }


  async findAll() {
    return await this.ressourceRepository.find({
      relations: ['session']
    });
  }

async findBySession(sessionId: number) {

  return await this.ressourceRepository
    .createQueryBuilder('ressource')
    .where('ressource.session = :sessionId', { sessionId })
    .getMany();
}

  async remove(id: number) {
    return await this.ressourceRepository.softRemove({ id });
  }

  async recover(id: number) {
    return await this.ressourceRepository.recover({ id });
  }
}
