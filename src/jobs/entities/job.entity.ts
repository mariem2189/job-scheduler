import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cronTime: string;

  @Column()
  lastRun: Date;

  @Column()
  nextRun: Date;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;
}
