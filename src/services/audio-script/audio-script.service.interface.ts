import {
  CreateClipRequest,
  CreateClipResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectResponse,
} from './audio-script.types';

export interface IAudioScriptService {
  createProject(project: CreateProjectRequest): Promise<CreateProjectResponse>;
  deleteProject(projectId: string): Promise<DeleteProjectResponse>;
  createClip(
    projectId: string,
    clip: CreateClipRequest,
  ): Promise<CreateClipResponse>;
  downloadFile(url: string, retryCount?: number): Promise<Buffer | string>;
}
