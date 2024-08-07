import { v4 as uuidv4 } from 'uuid';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Audio, Paragraph, Project, User, Voice } from '../../entities';
import {
  CreateParagraphRequest,
  CreateProjectRequest,
  UpdateParagraphRequest,
  UpdateProjectRequest,
} from './dto';
import { AUDIO_SCRIPT_SERVICE, STORAGE_SERVICE } from '../../services/services';
import { IAudioScriptService } from '../../services/audio-script/audio-script.service.interface';
import { IStorageService } from '../../services/storage/storage.service.interface';
import { patchIfPresent } from '../../utils';
import { PaginationQueryRequestDto } from '../../shared/dtos';

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

  public async getAll(user: User, paginationQuery: PaginationQueryRequestDto) {
    const { page, limit, orderBy, search } = paginationQuery;
    const skippedItems = (page - 1) * limit;

    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.paragraphs', 'paragraph')
      .leftJoin('paragraph.audios', 'audio')
      .leftJoin('paragraph.voice', 'voice')
      .select('project')
      .addSelect('COUNT(paragraph.id)', 'paragraphsCount')
      .addSelect('SUM(audio.durationInSeconds)', 'totalDuration')
      .addSelect('COUNT(DISTINCT voice.id)', 'distinctVoicesCount')
      .where('project.userId = :userId', { userId: user.id })
      .groupBy('project.id');

    switch (orderBy) {
      case 'recent':
        query.orderBy('project.createdAt', 'DESC');
        break;
      case 'old':
        query.orderBy('project.createdAt', 'ASC');
        break;
      case 'az':
        query.orderBy('project.name', 'ASC');
        break;
      case 'za':
        query.orderBy('project.name', 'DESC');
        break;
      default:
        query.orderBy('project.createdAt', 'DESC');
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(project.name) LIKE :search', {
            search: `%${search.toLowerCase()}%`,
          }).orWhere('LOWER(project.description) LIKE :search', {
            search: `%${search.toLowerCase()}%`,
          });
        }),
      );
    }

    const totalCount = await query.getCount();
    const projects = await query
      .skip(skippedItems)
      .take(limit)
      .getRawAndEntities();

    return {
      filter: paginationQuery,
      totalCount,
      page,
      data: projects.entities.map((project, index) => ({
        ...project,
        paragraphsCount: parseInt(projects.raw[index].paragraphsCount, 10),
        totalDuration: parseFloat(projects.raw[index].totalDuration),
        distinctVoicesCount: parseInt(
          projects.raw[index].distinctVoicesCount,
          10,
        ),
      })),
    };
  }

  public async getProjectById(user: User, projectId: string) {
    return await this.projectRepository.find({
      where: {
        id: projectId,
        user: {
          id: user.id,
        },
      },
    });
  }

  public async update(
    user: User,
    projectId: string,
    patchProject: UpdateProjectRequest,
  ) {
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        user: {
          id: user.id,
        },
      },
    });

    if (!project) {
      throw new NotFoundException();
    }

    patchIfPresent(project, 'name', patchProject.name);
    patchIfPresent(project, 'description', patchProject.description);

    await this.projectRepository.update(projectId, {
      ...project,
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
              isSelected: a.isSelected,
              audioSrc: audioSrc,
              durationInSeconds: a.durationInSeconds,
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

  public async updateParagraph(
    loggedUser: User,
    projectId: string,
    paragraphId: string,
    updateParagraph: UpdateParagraphRequest,
  ) {
    const paragraph = await this.paragraphRepository.findOne({
      relations: ['project', 'voice'],
      where: {
        project: {
          id: projectId,
          user: {
            id: loggedUser.id,
          },
        },
        id: paragraphId,
      },
    });

    if (!paragraph) {
      throw new NotFoundException('Paragrafo não foi encontrado');
    }

    if (updateParagraph.voiceId) {
      const voice = await this.voiceRepository.findOne({
        select: ['id', 'providerId'],
        where: {
          id: updateParagraph.voiceId,
          isActive: true,
        },
      });

      if (!voice) {
        throw new NotFoundException('Voz não foi encontrada');
      }
    }

    patchIfPresent(paragraph, 'body', updateParagraph.body);
    patchIfPresent(paragraph.voice, 'id', updateParagraph.voiceId);

    await this.paragraphRepository.update(paragraph.id, {
      ...paragraph,
    });

    return await this.paragraphRepository.findOneBy({ id: paragraph.id });
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

    return await this.paragraphRepository.save(
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
  }

  public async generatePreview(
    loggedUser: User,
    projectId: string,
    paragraphId: string,
  ) {
    const paragraph = await this.paragraphRepository.findOne({
      relations: ['project', 'voice'],
      where: {
        project: {
          id: projectId,
          user: {
            id: loggedUser.id,
          },
        },
        id: paragraphId,
      },
    });

    if (!paragraph) {
      throw new NotFoundException('Paragrafo não foi encontrado');
    }

    const clip = await this.audioScriptService.createClip(
      paragraph.project.providerId,
      {
        body: paragraph.body,
        voice_uuid: paragraph.voice.providerId,
        output_format: 'mp3',
      },
    );

    const { timestamps } = clip.item;

    const startTimes = timestamps.phon_times.map((times) => times[0]);
    const endTimes = timestamps.phon_times.map((times) => times[1]);

    const minStartTime = Math.min(...startTimes);
    const maxEndTime = Math.max(...endTimes);

    const durationInSeconds = maxEndTime - minStartTime;

    const fullPath = `paragraphs/${paragraph.project.id}/${uuidv4()}.mp3`;

    const audioDownloaded = await this.audioScriptService.downloadFile(
      clip.item.audio_src,
    );
    const storageFileUrl = await this.storageService.upload(
      Buffer.from(audioDownloaded),
      fullPath,
    );

    await this.audioRepository
      .createQueryBuilder()
      .update(Audio)
      .set({ isSelected: false })
      .where('paragraph.id = :paragraphId', { paragraphId })
      .execute();

    await this.audioRepository.save(
      this.audioRepository.create({
        storageFileUrl,
        storageProviderKey: fullPath,
        paragraph: {
          id: paragraph.id,
        },
        durationInSeconds,
        isSelected: true,
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
          isSelected: a.isSelected,
          audioSrc: audioSrc,
          durationInSeconds: a.durationInSeconds,
        };
      }),
    );

    return {
      ...createdParagraph,
      audios,
    };
  }

  public async selectAudio(
    loggedUser: User,
    projectId: string,
    paragraphId: string,
    audioId: string,
  ) {
    const paragraph = await this.paragraphRepository.findOne({
      relations: ['project', 'voice'],
      where: {
        project: {
          id: projectId,
          user: {
            id: loggedUser.id,
          },
        },
        id: paragraphId,
      },
    });

    if (!paragraph) {
      throw new NotFoundException('Paragrafo não foi encontrado');
    }

    const audio = await this.audioRepository.findOne({
      where: {
        id: audioId,
        paragraph: {
          id: paragraph.id,
        },
      },
    });

    if (!audio) {
      throw new NotFoundException('Audio não foi encontrado');
    }

    await this.audioRepository
      .createQueryBuilder()
      .update(Audio)
      .set({ isSelected: false })
      .where('paragraph.id = :paragraphId', { paragraphId })
      .execute();

    await this.audioRepository.update(audio.id, { isSelected: true });

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
          isSelected: a.isSelected,
          audioSrc: audioSrc,
          durationInSeconds: a.durationInSeconds,
        };
      }),
    );

    return {
      ...createdParagraph,
      audios,
    };
  }
}
