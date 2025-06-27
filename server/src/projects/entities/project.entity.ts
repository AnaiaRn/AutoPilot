import { Plan } from "src/plans/entities/plan.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre: string;

    @Column()
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    budget: number;

     @Column({ type: 'timestamp', nullable: false }) // Explicite NOT NULL
    deadline: Date;

    @OneToMany(() => Plan, plan => plan.project)
    plans: Plan[];
}
