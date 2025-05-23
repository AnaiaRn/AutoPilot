import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise <User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findById(+id);
  }

  @Put(':id')
  async update (
    @Param('id') id: string,
    @Body() updateData : Partial<User>,
  ): Promise<User> {
    return this.usersService.update(+id, updateData);
  }

  @Delete(':id')
  async remove (@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
 
}
