import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @Req() req) {
    return this.projectService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.projectService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.projectService.findOne(req.user.sub, +id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Req() req) {
    return this.projectService.update(req.user.sub, +id, dto);
  }

  @Delete(':id')
  remove(@Param('id')id: string, @Req() req) {
    return this.projectService.remove(req.user.sub, +id)
  }

 
 }

