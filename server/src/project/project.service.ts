import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';


@Injectable()
export class ProjectService {
 
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(userId: number, createProjectDto: CreateProjectDto) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      user: { id: userId},
    });
    return this.projectRepository.save(project);
  }

  async findAllByUser(userId: number) {
    return this.projectRepository.find({
      where: { user: { id: userId }},
    });
  }

  async findOne(userId: number, projectId: number) {
    return this.projectRepository.findOne({
      where : { id: projectId, user : { id: userId }},
    });
  }

  async update(userId: number, projectId: number, updateData: UpdateProjectDto) {
    await this.projectRepository.update(
      {id: projectId, user: { id: userId}},
      updateData,
    );
    return this.findOne(userId, projectId);
  }

  async remove(userId: number, projectId: number) {
    const result = await this.projectRepository.delete({
      id: projectId,
      user: { id: userId},
    });
    if (result.affected === 0) {
      throw new NotImplementedException('Project not found');
    }
  }
}
