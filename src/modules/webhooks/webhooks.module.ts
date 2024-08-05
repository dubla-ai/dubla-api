import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan, User, UserPlan } from '../../entities';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Plan, UserPlan])],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
