import { Injectable } from '@nestjs/common';
import { BaseProvider } from '../base';
import { AxiosError } from 'axios';
import {
  CreateProjectRequest,
  CreateProjectResponse,
  CreateVoiceRequest,
  CreateVoiceResponse,
  GetProjectResponse,
  TextToSpeechRequest,
  TextToSpeechResponse,
} from '../../services/audio-script/audio-script.types';

@Injectable()
export class ElevenLabsProvider extends BaseProvider {
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
    return 'https://api.elevenlabs.io';
  }

  protected get baseHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'xi-api-key': `${process.env.ELEVEN_LABS_API_KEY}`,
    };
  }

  public async createProject(
    project: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    return await this.client.post<any, CreateProjectResponse>(
      `/v1/projects/add`,
      {
        project,
      },
    );
  }

  public async deleteProject(projectId: string) {
    return await this.client.delete<any, any>(`/v1/projects/${projectId}`);
  }

  public async getProject(projectId: string): Promise<GetProjectResponse> {
    return await this.client.get<any, GetProjectResponse>(
      `/v1/projects/${projectId}`,
    );
  }

  public async textToSpeech(
    voiceId: string,
    clip: TextToSpeechRequest,
  ): Promise<TextToSpeechResponse> {
    return await this.client.post<any, TextToSpeechResponse>(
      `/v1/text-to-speech/${voiceId}/with-timestamps`,
      clip,
    );
  }

  public async createVoice(
    voice: CreateVoiceRequest,
  ): Promise<CreateVoiceResponse> {
    const formData = new FormData();

    formData.append('name', voice.name);
    formData.append(`files`, voice.file);

    return await this.client.post<any, CreateVoiceResponse>(
      `/v1/voices/add`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  public async deleteVoice(voiceId: string) {
    return await this.client.delete<any, any>(`/v1/voices/${voiceId}`);
  }
}
