import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Plan, User } from './';

@Entity({ name: 'user_plans' })
export class UserPlan extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userPlans)
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.userPlans)
  plan: Plan;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'json' })
  paymentDetails: any;
}
