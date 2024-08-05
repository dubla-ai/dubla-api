import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project, Voice, UserPlan } from './';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  cpf: string;

  @Column()
  password: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Voice, (voice) => voice.user)
  voices: Voice[];

  @OneToMany(() => UserPlan, (userPlan) => userPlan.user)
  userPlans: UserPlan[];
}
