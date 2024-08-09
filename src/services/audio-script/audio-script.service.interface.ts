import {
  CreateProjectRequest,
  CreateProjectResponse,
  TextToSpeechRequest,
  TextToSpeechResponse,
} from './audio-script.types';

export interface IAudioScriptService {
  createProject(project: CreateProjectRequest): Promise<CreateProjectResponse>;
  deleteProject(projectId: string);
  textTooSpeech(
    voiceId: string,
    clip: TextToSpeechRequest,
  ): Promise<TextToSpeechResponse>;
  downloadFile(url: string, retryCount?: number): Promise<Buffer | string>;
}
