import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../Enums/user-role.enum';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async findOneUser(id: number): Promise<Partial<User | null>> {
    const user = await this.userRepository.findOne({ where: { id } });
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      cin: user.cin,
      role: user.role,
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const newUser = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!newUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return await this.userRepository.save(newUser);
  }

  async softDeleteUser(id: number) {
    const userToRemove = await this.userRepository.findOneBy({ id });
    if (!userToRemove) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return await this.userRepository.softDelete(id);
  }

  async restoreUser(id: number) {
    return await this.userRepository.restore(id);
  }

  async findAllUsers() {
    return await this.userRepository.find();
  }

  async changePassword(user: User, oldPassword: string, newPassword: string) {
    const userData = await this.userRepository.findOneBy({ id: user.id });
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userData.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid Old password');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = await bcrypt.hash(newPassword, salt);
    user.salt = salt;
    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      cin: user.cin,
      role: user.role,
    };
  }

  async editphoto(user: User, photo: Express.Multer.File) {
    console.log('userrrrr', user);
    let photoPath: string;
    if (photo) {
      console.log('Image received:', photo);
      console.log(photo, user.id, user.username);

      try {
        // Upload photo to Azure Blob Storage
        const uploadResult = await this.fileUploadService.uploadFile(
          photo,
          'user_uploads',
        );
        // Construct the photo URL
        photoPath = uploadResult.url;

        console.log(photoPath);
      } catch (uploadError) {
        console.error('Error uploading image to Azure:', uploadError);
        throw new Error('Failed to upload image to Azure');
      }

      await this.userRepository.update(user.id, { photo: photoPath });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        cin: user.cin,
        role: user.role,
        photo: photoPath,
      };
    } else {
      throw new NotFoundException('No photo provided');
    }
  }
}
