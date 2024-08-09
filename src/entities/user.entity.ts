import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project, Voice, UserPlan } from './';
import { Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  constructor() {
    super();
    this.planSeconds = 0;
    this.planVoices = 0;
    this.usedDurationInSeconds = 0;
    this.availableDurationInSeconds = 0;
    this.availableVoicesToCreate = 0;
  }

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  cpf: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  userOrigin: string;

  @Column()
  password: string;

  @Expose()
  planSeconds: number;

  @Expose()
  planVoices: number;

  @Expose()
  usedDurationInSeconds: number;

  @Expose()
  availableDurationInSeconds: number;

  @Expose()
  availableVoicesToCreate: number;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Voice, (voice) => voice.user)
  voices: Voice[];

  @OneToOne(() => UserPlan, (userPlan) => userPlan.user, { cascade: true })
  userPlan: UserPlan;
}
