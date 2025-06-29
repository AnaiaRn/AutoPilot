import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { PlanGeneratorService } from './plan-generator.service';
import { PlansController } from './plans.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    ProjectsModule,
  ],
  controllers: [PlansController],
  providers: [PlanGeneratorService],
  exports: [PlanGeneratorService], // Important pour l'export
})
export class PlansModule {}