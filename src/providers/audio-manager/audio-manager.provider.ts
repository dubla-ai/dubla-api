import { Injectable } from '@nestjs/common';
import { BaseProvider } from '../base';
import { AxiosError } from 'axios';
import { MergeAudiosRequest, MergeAudiosResponse } from './types';

@Injectable()
export class AudioManagerProvider extends BaseProvider {
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

  protected get baseHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': `${process.env.AUDIO_MANAGER_API_KEY}`,
    };
  }

  public async mergeAudios(
    mergeAudios: MergeAudiosRequest,
  ): Promise<MergeAudiosResponse> {
    return await this.client.post<any, MergeAudiosResponse>(
      `https://ehyi7ap7zxtxaimjaic4jq3wny0kufcf.lambda-url.us-east-1.on.aws`,
      mergeAudios,
      {
        timeout: 60000,
      },
    );
  }
}
