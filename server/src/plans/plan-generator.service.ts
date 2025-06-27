import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class PlanGeneratorService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_KEY'),
    });
  }

  async generatePlan(project: Project): Promise<Plan> {
    const prompt = this.buildPrompt(project);
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo',
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(completion.choices[0].message.content);

    const plan = this.planRepository.create({
      project,
      content,
    });

    return this.planRepository.save(plan);
  }

  private buildPrompt(project: Project): string {
    return `
      Agis comme un chef de projet expérimenté. Pour le projet '${project.titre}' (${project.description}), 
      avec un budget de ${project.budget}€ et une échéance le ${project.deadline}, fournis :
      1. Un découpage en phases claires (nom, durée, tâches clés, livrables)
      2. Une répartition réaliste des ressources (équipe, budget par phase)
      3. 3 risques majeurs avec solutions concrètes.
      
      Format : JSON strict avec les clés ['phases', 'ressources', 'risques'].
      
      Exemple de format attendu :
      {
        "phases": [
          {
            "nom": "Conception Technique",
            "duree_estimee": "3 semaines",
            "taches_cles": ["Rédiger spécifications", "Prototyper UX"],
            "livrables": ["Cahier des charges validé", "Maquettes Figma"]
          }
        ],
        "ressources": {
          "equipe": ["1 PO", "2 Dev Fullstack", "1 UX Designer"],
          "budget_alloue": "15000€ (30%)"
        },
        "risques": [
          {
            "description": "Délai de validation client",
            "solution": "Planifier 3 points de validation intermédiaires"
          }
        ]
      }
    `;
  }

  async getPlansForProject(projectId: number): Promise<Plan[]> {
    return this.planRepository.find({
      where: { project: { id: projectId } },
      order: { generatedAt: 'DESC' },
    });
  }
}