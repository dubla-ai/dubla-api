import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Plan, User } from './';

@Entity({ name: 'user_plans' })
export class UserPlan extends BaseEntity {
  @OneToOne(() => User, (user) => user.userPlan, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.userPlans)
  @JoinColumn()
  plan: Plan;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'json', select: false, nullable: true })
  paymentDetails: any;
}
