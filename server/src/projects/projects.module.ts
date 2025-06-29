import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => PlansModule), // Utilisation de forwardRef
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService, TypeOrmModule], // Export du service et du repository
})
export class ProjectsModule {}