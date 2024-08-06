import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { KirvanoWebhookEvent } from './types';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('notify')
  @HttpCode(200)
  recharge(
    @Headers() headers: { 'security-token': string },
    @Body() body: KirvanoWebhookEvent,
  ) {
    if (headers['security-token'] !== process.env.KIRVANO_SECURITY_TOKEN) {
      throw new UnauthorizedException();
    }

    return this.webhooksService.notification(body);
  }
}
