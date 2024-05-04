import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findAllAdmins() {
    return await this.adminRepository.find({
      select: ['id', 'email', 'username', 'cin'],
    });
  }

  async countAdmins() {
    return await this.adminRepository.count();
  }

  async findOneAdmin(id: number) {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      cin: admin.cin,
    };
  }

  async updateAdmin(id: number, data: Partial<Admin>) {
    const admin = await this.findOneAdmin(id);
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    await this.adminRepository.update(id, data);
    return await this.findOneAdmin(id);
  }
}
