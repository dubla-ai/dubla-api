import { Injectable, Logger } from '@nestjs/common';
import { KirvanoWebhookEvent } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan, User, UserPlan } from '../../entities';
import { In, Repository } from 'typeorm';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';

@Injectable()
export class WebhooksService {
  private logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(UserPlan)
    private userPlanRepository: Repository<UserPlan>,
  ) {}
  public async notification(body: KirvanoWebhookEvent) {
    switch (body.status) {
      case 'APPROVED':
        await this.createPlan(body);
        break;
      case 'REFUNDED':
        await this.disablePlan(body);
      case 'CHARGEBACK':
        await this.disablePlan(body);
        break;
      default:
        break;
    }
  }

  private async createPlan(body: KirvanoWebhookEvent) {
    const user = await this.userRepository.findOne({
      where: {
        cpf: body.customer.document,
      },
    });

    if (!user) {
      this.logger.error({ message: 'Could not find user on payment', body });
      return;
    }

    const planNames = body.products.map((p) => p.offer_name);

    const plan = await this.planRepository.findOne({
      where: {
        name: In(planNames),
      },
    });

    if (!plan) {
      this.logger.error({ message: 'Could not find plan on payment', body });
      return;
    }

    await this.userPlanRepository.save(
      this.userPlanRepository.create({
        paymentDetails: body,
        startDate: new Date(),
        endDate: addMonths(new Date(), 1),
        plan: {
          id: plan.id,
        },
        user: {
          id: user.id,
        },
      }),
    );
  }

  private async disablePlan(body: KirvanoWebhookEvent) {
    const user = await this.userRepository.findOne({
      where: {
        cpf: body.customer.document,
      },
    });

    if (!user) {
      this.logger.error({ message: 'Could not find user on payment', body });
      return;
    }

    const planNames = body.products.map((p) => p.name);

    const plan = await this.planRepository.findOne({
      where: {
        name: In(planNames),
      },
    });

    if (!plan) {
      this.logger.error({ message: 'Could not find plan on payment', body });
      return;
    }

    const userPlans = await this.userPlanRepository.find({
      where: {
        user: {
          id: user.id,
        },
        plan: {
          id: plan.id,
        },
      },
    });

    for (const userPlan of userPlans) {
      await this.userPlanRepository.softDelete(userPlan.id);
    }

    const freePlan = await this.planRepository.findOne({
      where: {
        name: 'Gratuito',
      },
    });

    await this.userPlanRepository.save(
      this.userPlanRepository.create({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
        plan: {
          id: freePlan.id,
        },
        user: {
          id: user.id,
        },
      }),
    );
  }
}
