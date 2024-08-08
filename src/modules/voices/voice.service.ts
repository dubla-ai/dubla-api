import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voice } from '../../entities';
import { STORAGE_SERVICE } from '../../services/services';
import { IStorageService } from '../../services/storage/storage.service.interface';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    @InjectRepository(Voice)
    private voiceRepository: Repository<Voice>,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  public async getAll() {
    const voices = await this.voiceRepository.find({
      where: {
        isActive: true,
      },
    });

    return await Promise.all(
      voices.map(async (voice) => {
        const audioSrc = await this.storageService.getSignedUrl(voice.preview);
        return {
          ...voice,
          preview: audioSrc,
        };
      }),
    );
  }
}
