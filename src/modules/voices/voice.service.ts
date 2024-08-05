import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voice } from '../../entities';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    @InjectRepository(Voice)
    private voiceRepository: Repository<Voice>,
  ) {}

  public async getAll() {
    return await this.voiceRepository.find({
      where: {
        isActive: true,
      },
    });
  }
}
