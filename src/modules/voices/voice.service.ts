import { v4 as uuidv4 } from 'uuid';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Like, Repository } from 'typeorm';
import { User, Voice } from '../../entities';
import { AUDIO_SCRIPT_SERVICE, STORAGE_SERVICE } from '../../services/services';
import { IStorageService } from '../../services/storage/storage.service.interface';
import { CloneVoiceRequest, GetVoicesRequest } from './dto';
import { IAudioScriptService } from '../../services/audio-script/audio-script.service.interface';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    @InjectRepository(Voice)
    private voiceRepository: Repository<Voice>,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    @Inject(AUDIO_SCRIPT_SERVICE)
    private readonly audioScriptService: IAudioScriptService,
  ) {}

  public async getAll(user: User, query: GetVoicesRequest) {
    const wheres = [
      {
        isActive: true,
        user: {
          id: user.id,
        },
        ...(query.search ? { name: Like(`%${query.search}%`) } : {}),
      },
    ] as FindOptionsWhere<Voice>[];

    if (query.allVoices) {
      wheres.push({
        isActive: true,
        user: IsNull(),
        ...(query.search ? { name: Like(`%${query.search}%`) } : {}),
      });
    }

    const voices = await this.voiceRepository.find({
      where: wheres,
    });

    return await Promise.all(
      voices.map(async (voice) => {
        return {
          ...voice,
          preview: voice.preview
            ? await this.storageService.getSignedUrl(voice.preview)
            : null,
        };
      }),
    );
  }

  public async delete(user: User, voiceId: string) {
    const voice = await this.voiceRepository.findOne({
      where: {
        isActive: true,
        id: voiceId,
        user: {
          id: user.id,
        },
      },
    });

    if (!voice) {
      throw new NotFoundException();
    }

    await this.voiceRepository.update(
      {
        isActive: true,
        id: voiceId,
        user: {
          id: user.id,
        },
      },
      {
        isActive: false,
      },
    );
  }

  public async edit(
    user: User,
    voiceRequest: CloneVoiceRequest,
    voiceId: string,
  ) {
    const voice = await this.voiceRepository.findOne({
      where: {
        isActive: true,
        id: voiceId,
        user: {
          id: user.id,
        },
      },
    });

    if (!voice) {
      throw new NotFoundException();
    }

    await this.voiceRepository.update(
      {
        id: voiceId,
        user: {
          id: user.id,
        },
      },
      {
        name: voiceRequest.name,
      },
    );
  }

  public async clone(
    user: User,
    file: Express.Multer.File,
    cloneVoice: CloneVoiceRequest,
  ) {
    if (!user.availableVoicesToCreate) {
      throw new ForbiddenException('Créditos insuficientes');
    }

    if (!file?.originalname) {
      throw new ForbiddenException('Arquivo inválido');
    }

    const fileMegaBytes = file?.size / 1024 / 1000;

    if (fileMegaBytes > 10) {
      throw new ForbiddenException(
        'Tamanho do arquivo deve ter no máximo 10MB',
      );
    }

    const blob = new Blob([file.buffer], { type: 'application/octet-stream' });

    const voice = await this.audioScriptService.createVoice({
      name: cloneVoice.name,
      file: blob,
    });

    const speech = await this.audioScriptService.textTooSpeech(voice.voice_id, {
      text: 'Ao recriar minha voz com a avançada tecnologia da Dubla aí, estou iniciando uma jornada repleta de inovação e possibilidades',
      model_id: 'eleven_turbo_v2_5',
    });

    const fullPath = `demos/${user.id}/${uuidv4()}.mp3`;

    const audioDownloaded = Buffer.from(speech.audio_base64, 'base64');
    await this.storageService.upload(Buffer.from(audioDownloaded), fullPath);

    await this.voiceRepository.save(
      this.voiceRepository.create({
        user,
        name: cloneVoice.name,
        providerId: voice.voice_id,
        preview: fullPath,
        isActive: true,
      }),
    );
  }
}
