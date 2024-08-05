import { v4 as uuidv4 } from 'uuid';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audio, Paragraph, Project, User, Voice } from '../../entities';
import { CreateParagraphRequest, CreateProjectRequest } from './dto';
import { AUDIO_SCRIPT_SERVICE, STORAGE_SERVICE } from '../../services/services';
import { IAudioScriptService } from '../../services/audio-script/audio-script.service.interface';
import { IStorageService } from '../../services/storage/storage.service.interface';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @Inject(AUDIO_SCRIPT_SERVICE)
    private readonly audioScriptService: IAudioScriptService,
    @InjectRepository(Audio)
    private audioRepository: Repository<Audio>,
    @InjectRepository(Voice)
    private voiceRepository: Repository<Voice>,
    @InjectRepository(Paragraph)
    private paragraphRepository: Repository<Paragraph>,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  public async create(user: User, project: CreateProjectRequest) {
    const projectExists = await this.projectRepository.find({
      where: {
        name: project.name,
        user: {
          id: user.id,
        },
      },
    });

    if (projectExists?.length) {
      throw new ForbiddenException('Projeto com esse nome já existe');
    }

    const audioScriptProject =
      await this.audioScriptService.createProject(project);

    if (!audioScriptProject.success) {
      throw new Error('Could not create project');
    }

    const projectCreated = await this.projectRepository.save(
      this.projectRepository.create({
        ...project,
        providerId: audioScriptProject.item.uuid,
        user: {
          id: user.id,
        },
      }),
    );

    return {
      id: projectCreated.id,
      name: projectCreated.name,
      description: projectCreated.description,
      createdAt: projectCreated.createdAt,
      updatedAt: projectCreated.updatedAt,
    };
  }

  public async getAll(user: User) {
    return await this.projectRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  public async delete(user: User, projectId: string) {
    const project = await this.projectRepository.findOne({
      select: ['id', 'providerId'],
      where: {
        user: {
          id: user.id,
        },
        id: projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto nao existe');
    }

    await this.projectRepository.softDelete(projectId);
  }

  public async getParagraphs(loggedUser: User, projectId: string) {
    const project = await this.projectRepository.findOneBy({
      user: {
        id: loggedUser.id,
      },
      id: projectId,
    });

    if (!project) {
      throw new NotFoundException('Projeto não foi encontrado');
    }

    const paragraphs = await this.paragraphRepository.find({
      relations: ['audios'],
      where: {
        project: {
          id: projectId,
        },
      },
    });

    return Promise.all(
      paragraphs.map(async (p) => {
        const audiosWithUrls = await Promise.all(
          p.audios.map(async (a) => {
            const audioSrc = await this.storageService.getSignedUrl(
              a.storageProviderKey,
            );
            return {
              id: a.id,
              createdAt: a.createdAt,
              audioSrc: audioSrc,
            };
          }),
        );

        return {
          ...p,
          audios: audiosWithUrls,
        };
      }),
    );
  }

  public async createParagraph(
    loggedUser: User,
    projectId: string,
    createParagraph: CreateParagraphRequest,
  ) {
    const project = await this.projectRepository.findOne({
      select: ['id', 'providerId'],
      where: {
        user: {
          id: loggedUser.id,
        },
        id: projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não foi encontrado');
    }

    const voice = await this.voiceRepository.findOne({
      select: ['id', 'providerId'],
      where: {
        id: createParagraph.voiceId,
        isActive: true,
      },
    });

    if (!voice) {
      throw new NotFoundException('Voz não foi encontrada');
    }

    const clip = await this.audioScriptService.createClip(project.providerId, {
      body: createParagraph.body,
      voice_uuid: voice.providerId,
      output_format: 'mp3',
    });

    const fullPath = `paragraphs/${project.id}/${uuidv4()}.mp3`;

    const audioDownloaded = await this.audioScriptService.downloadFile(
      clip.item.audio_src,
    );
    const storageFileUrl = await this.storageService.upload(
      Buffer.from(audioDownloaded),
      fullPath,
    );

    const paragraph = await this.paragraphRepository.save(
      this.paragraphRepository.create({
        project: {
          id: project.id,
        },
        voice: {
          id: voice.id,
        },
        body: createParagraph.body,
      }),
    );

    await this.audioRepository.save(
      this.audioRepository.create({
        storageFileUrl,
        storageProviderKey: fullPath,
        paragraph: {
          id: paragraph.id,
        },
      }),
    );

    const createdParagraph = await this.paragraphRepository.findOne({
      relations: ['audios'],
      where: {
        id: paragraph.id,
      },
    });

    const audios = await Promise.all(
      createdParagraph.audios.map(async (a) => {
        const audioSrc = await this.storageService.getSignedUrl(
          a.storageProviderKey,
        );
        return {
          id: a.id,
          createdAt: a.createdAt,
          audioSrc: audioSrc,
        };
      }),
    );

    return {
      ...createdParagraph,
      audios,
    };
  }
}
