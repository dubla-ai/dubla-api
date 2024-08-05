import { Injectable } from '@nestjs/common';
import { BaseProvider } from '../base';
import { AxiosError } from 'axios';
import { CreateProjectRequest } from '../../modules/projects/dto';
import {
  CreateClipRequest,
  CreateClipResponse,
  CreateProjectResponse,
  DeleteProjectResponse,
} from '../../services/audio-script/audio-script.types';

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
    return 'https://app.resemble.ai';
  }

  protected get baseHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.RESEMBLE_API_KEY}`,
    };
  }

  public async createProject(
    project: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    return await this.client.post<any, CreateProjectResponse>(
      `/api/v2/projects`,
      {
        project,
      },
    );
  }

  public async deleteProject(
    projectId: string,
  ): Promise<DeleteProjectResponse> {
    return await this.client.delete<any, DeleteProjectResponse>(
      `/api/v2/projects/${projectId}`,
    );
  }

  public async getProject(projectId: string): Promise<CreateProjectResponse> {
    return await this.client.get<any, CreateProjectResponse>(
      `/api/v2/projects/${projectId}`,
    );
  }

  public async createClip(
    projectId: string,
    clip: CreateClipRequest,
  ): Promise<CreateClipResponse> {
    return await this.client.post<any, CreateClipResponse>(
      `/api/v2/projects/${projectId}/clips`,
      clip,
    );
  }
}
