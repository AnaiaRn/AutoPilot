import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as brcypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
 constructor (
  @InjectRepository(User)
  private usersRepository: Repository<User>,
 ) {}

 async create (createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
  const existingUser = await this.usersRepository.findOne({
    where: [{ username: createUserDto.username}, { email: createUserDto.email}],
  });

  if (existingUser) {
    throw new ConflictException('Username or email already exists');
  }

  const hashedPassword = await brcypt.hash(createUserDto.password, 10);
  const newUser = this.usersRepository.create({
    ...createUserDto, password: hashedPassword,
  });

  const { password, ...result } = await this.usersRepository.save(newUser);

  return result;
 }

 async findAll(): Promise<Omit<User, 'password'>[]> {
  try {
    const users = await this.usersRepository.find();
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    throw new InternalServerErrorException('Failed to retrieve users');
  }
}


 async findOne(id: number): Promise<Omit<User, 'password'>> {
  const user = await this.usersRepository.findOneBy({ id });
  if (!user) throw new NotFoundException('User not found');
  const { password, ...result} = user;
  return result;
 }

 async findByUsernameWithPassword(username: string): Promise <User> {
  return this.usersRepository.createQueryBuilder('user')
  .addSelect('user password')
  .where('user.username = :username', {username})
  .getOne();
 }

 async update (id: number, updateData: Partial<User>): Promise<Omit<User, 'password'>> {
 const result = await this.usersRepository.update(id, updateData);
  if (result.affected === 0) {
    throw new NotFoundException('User not found');
  }
  return this.findOne(id);
 }

 async remove(id: number): Promise<void> {
  const result = await this.usersRepository.delete(id);
  
  if (result.affected === 0) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
}
}
