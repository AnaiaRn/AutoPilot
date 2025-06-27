import { Project } from "src/projects/entities/project.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Plan {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, project => project.plans)
    project: Project;

    @Column({ type: 'jsonb' })
    content: {
        phases: Array<{
            nom: string;
            duree_estimee: string;
            taches_cles: string[];
            livrables: string[];
        }>;
        ressources: {
            equipe: string[];
            budget_alloue: string;
        };
        risques: Array<{
            description: string;
            solution: string;
        }>;
    };

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    generatedAt: Date;
    
}
