import {
  CreateProjectRequest,
  CreateProjectResponse,
  CreateVoiceRequest,
  CreateVoiceResponse,
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
  createVoice(voice: CreateVoiceRequest): Promise<CreateVoiceResponse>;
  downloadFile(url: string, retryCount?: number): Promise<Buffer | string>;
}
