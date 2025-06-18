import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
 
  constructor (
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(userId: number, createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      user: { id: userId },
    });
    return this.projectsRepository.save(project);
  }

  async findAllByUser(userId: number): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { user: { id: userId }},
    });
  }

  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne ({
      where: { id, user: { id: userId }},
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, userId: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.projectsRepository.update(
      {id, user: { id: userId }},
      updateProjectDto,
    );
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.projectsRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
