import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as brcypt from 'bcrypt'

@Injectable()
export class UsersService {
 constructor (
  @InjectRepository(User)
  private usersRepository: Repository<User>
 ) {}

 async create(user: Partial<User>): Promise<User> {
  const existingUser = await this.usersRepository.findOne({ 
    where: { username: user.username } 
  });

  if (existingUser) {
    throw new ConflictException('Username déjà pris');
  }

  const hashedPassword = await brcypt.hash(user.password, 10);
  const newUser = this.usersRepository.create({
    ...user,
    password: hashedPassword
  });

  return this.usersRepository.save(newUser);
 }

 async findOne (username: string): Promise<User | undefined> {
  return this.usersRepository.findOne({ where : {username }});
 }

 async findAll(): Promise<User[]> {
  return this.usersRepository.find();
 }

 async update(id: number, updateData: Partial<User>): Promise<User> {
  await this.usersRepository.update(id, updateData);
  return this.usersRepository.findOne({ where : {id}});
 }

 async remove(id: number): Promise<void> {
  await this.usersRepository.delete(id);
 }
  
}
