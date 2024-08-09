import { Injectable } from '@nestjs/common';
import { IAudioScriptService } from './audio-script.service.interface';
import { ElevenLabsProvider } from '../../providers/elevenlabs/elevenlabs.provider';
import {
  CreateProjectRequest,
  CreateProjectResponse,
  TextToSpeechRequest,
  TextToSpeechResponse,
} from './audio-script.types';

@Injectable()
export class AudioScriptService implements IAudioScriptService {
  constructor(private readonly elevenLabsProvider: ElevenLabsProvider) {}

  public async createProject(
    project: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    return await this.elevenLabsProvider.createProject(project);
  }

  public async deleteProject(projectId: string) {
    return await this.elevenLabsProvider.deleteProject(projectId);
  }

  public async textTooSpeech(
    voiceId: string,
    clip: TextToSpeechRequest,
  ): Promise<TextToSpeechResponse> {
    return await this.elevenLabsProvider.textToSpeech(voiceId, clip);
  }

  async downloadFile(
    url: string,
    retryCount: number = 5,
  ): Promise<Buffer | string> {
    return await this.elevenLabsProvider.downloadFile(url, retryCount);
  }
}
