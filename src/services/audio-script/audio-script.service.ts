import { Injectable } from '@nestjs/common';
import { IAudioScriptService } from './audio-script.service.interface';
import { ResembleProvider } from '../../providers/resemble/resemble.provider';
import {
  CreateClipRequest,
  CreateClipResponse,
  CreateProjectRequest,
  CreateProjectResponse,
} from './audio-script.types';

@Injectable()
export class AudioScriptService implements IAudioScriptService {
  constructor(private readonly resemble: ResembleProvider) {}

  public async createProject(
    project: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    return await this.resemble.createProject(project);
  }

  public async createClip(
    projectId: string,
    clip: CreateClipRequest,
  ): Promise<CreateClipResponse> {
    return await this.resemble.createClip(projectId, clip);
  }

  async downloadFile(
    url: string,
    retryCount: number = 5,
  ): Promise<Buffer | string> {
    return await this.resemble.downloadFile(url, retryCount);
  }
}
