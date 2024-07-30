import { Injectable } from '@nestjs/common';
import { BaseProvider } from '../base';
import { AxiosError } from 'axios';

@Injectable()
export class ResembleProvider extends BaseProvider {
  constructor() {
    super();
  }

  protected async processError(error: AxiosError) {
    const status = error?.response?.status;
    const message = error?.response?.data['message'] || '';

    if (
      status === 503 ||
      status === 500 ||
      message.includes('Too many request')
    ) {
      return { error, shouldRetry: true };
    }

    return { error, shouldRetry: false };
  }

  protected getBaseUrl(): string {
    return process.env.RESEMBLE_BASE_URL;
  }

  protected get baseHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authornization: `Bearer ${process.env.RESEMBLE_API_KEY}`,
    };
  }

  public async example(request: any): Promise<string[]> {
    return await this.client.post<any, string[]>(`example`, {
      request,
    });
  }
}
