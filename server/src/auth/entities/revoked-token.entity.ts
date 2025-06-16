import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RevokedToken {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    @Index()
    token: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;
}