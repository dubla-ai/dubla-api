import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { KirvanoWebhookEvent } from './types';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('notify')
  @HttpCode(200)
  recharge(
    @Headers() headers: { 'asaas-access-token': string },
    @Body() body: KirvanoWebhookEvent,
  ) {
    // TODO: Uncomment once tested
    // if (headers['asaas-access-token'] !== process.env.ASAAS_ACCESS_TOKEN) {
    //   throw new UnauthorizedException();
    // }

    return this.webhooksService.notification(body);
  }
}
