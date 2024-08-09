import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserPlan } from './user_plan.entity';

@Entity({ name: 'plans' })
export class Plan extends BaseEntity {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  monthlyCredits: number;

  @Column({ default: 1 })
  monthlyVoiceCredits: number;

  @OneToMany(() => UserPlan, (userPlan) => userPlan.plan)
  userPlans: UserPlan[];
}
