import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { PlanGeneratorService } from 'src/plans/plan-generator.service';

@Injectable()
export class ProjectsService {
  constructor (
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private planGeneratorService: PlanGeneratorService,

  ) {}

 async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    const savedProject = await this.projectsRepository.save(project);

    try {
      await this.planGeneratorService.generatePlan(savedProject);
    } catch (error) {
      console.error('Failed to generate plan automatically', error);
    }
    return savedProject; // Retournez savedProject au lieu de sauvegarder à nouveau
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({ relations: ['plans'] });
  }

  async findOne(id: number): Promise<Project> {
    return this.projectsRepository.findOne({ 
      where: { id },
      relations: ['plans'] 
    });
  }

  onModuleInit() {
    this.projectsRepository.metadata.relations.forEach(relation => {
      if (relation.propertyName === 'plans') {
        relation.inverseSidePropertyPath = 'project';
      }
    })
  }

  async update (id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.projectsRepository.update(id, updateProjectDto);
    return this.projectsRepository.findOneBy({ id });
  }

  async remove (id: number): Promise<void> {
    await this.projectsRepository.delete(id);
  }
}
