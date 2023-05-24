import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private data: Repository<User>) { }

  async create(dto: CreateUserDto): Promise<User> {
    const salt = process.env["HASH_SALT"] || 12
    const hash = await bcrypt.hash(dto.password, salt)
    return this.data.save({ ...dto, hash })
  }

  findAll(): Promise<User[]> {
    return this.data.find()
  }

  findOne(id: number): Promise<User> {
    return this.data.findOneBy({ id })
  }

  findOneByEmail(email: string): Promise<User> {
    return this.data.findOneBy({ email })
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const salt = process.env["HASH_SALT"] || 12
    const hash = await bcrypt.hash(dto.password, salt)
    const done = await this.data.update(id, { ...dto, hash })
    if (done.affected == 1)
      return this.findOne(id)
    throw new NotFoundException()
  }

  async remove(id: number): Promise<number> {
    const done = await this.data.delete(id)
    return done.affected
  }
}
