import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: any,
  ) {
    if (!req.user || !req.user.sub) {
      throw new UnauthorizedException('Invalid user')
    }
  }

  @Get()
  findAll(@Req() req) {
    return this.projectsService.findAllByUser(req.user.id)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe)id: number, @Req() req) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
  ) {
    return this.projectsService.update(id, req.user.id, updateProjectDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.projectsService.remove(id, req.user.id)
  }
 
}
