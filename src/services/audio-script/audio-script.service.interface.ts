import {
  CreateClipRequest,
  CreateClipResponse,
  CreateProjectRequest,
  CreateProjectResponse,
} from './audio-script.types';

export interface IAudioScriptService {
  createProject(project: CreateProjectRequest): Promise<CreateProjectResponse>;
  createClip(
    projectId: string,
    clip: CreateClipRequest,
  ): Promise<CreateClipResponse>;
  downloadFile(url: string, retryCount?: number): Promise<Buffer | string>;
}
