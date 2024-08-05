import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project, Plan, Voice } from './';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Voice, (voice) => voice.user)
  voices: Voice[];

  @ManyToOne(() => Plan, (plan) => plan.users)
  plan: Plan;
}
