import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

import { CreateUserDto, UpdateUserDto } from '@dog-finder/models';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  private async hashPassword(password: string): Promise<string> {
    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(password, salt);
    return hashed;
  }
  async register(userCreateDto: CreateUserDto) {
    const user = this.userRepo.create(userCreateDto);
    user.password = await this.hashPassword(user.password);
    return this.userRepo.save(user);
  }
  async findOne(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: [{ email: email }] });
  }
  async delete(id: number) {
    return this.userRepo.delete(id);
  }
  async findOneIncludePassword(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
  async update(id: number, updateDto: UpdateUserDto) {
    if (updateDto.password)
      updateDto.password = await this.hashPassword(updateDto.password);
    await this.userRepo.update(id, updateDto);
    return this.userRepo.findOne({ where: { id } });
  }
}
