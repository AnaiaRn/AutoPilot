import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ProjectsService } from 'src/projects/projects.service';
import { PlanGeneratorService } from './plan-generator.service';


@Controller('projects/:id/plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(
    private readonly planGeneratorService: PlanGeneratorService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Post('generate')
  async generatePlan(@Param('id') projectId: number) {
    const project = await this.projectsService.findOne(projectId);
    return this.planGeneratorService.generatePlan(project);
  }

  @Get()
  async getPlans(@Param('id') projectId: number) {
    return this.planGeneratorService.getPlansForProject(projectId);
  }
}