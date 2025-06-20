import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ type: 'timestamp' })
    deadline: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    budget: number;

    @ManyToOne(() => User, (user) => user.projects)
    user: User;
}
