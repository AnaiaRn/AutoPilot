import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { PlansController } from './plans.controller';
import { ProjectsModule } from '../projects/projects.module';
import { PlanGeneratorService } from './plan-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]), // Ceci fournit le PlanRepository
    ProjectsModule, // Pour avoir accès au ProjectsService
  ],
  controllers: [PlansController],
  providers: [PlanGeneratorService],
  exports: [PlanGeneratorService], // Si d'autres modules en ont besoin
})
export class PlansModule {}