import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, User } from '../../entities';
import { CreateProjectRequest } from './dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  public async create(user: User, project: CreateProjectRequest) {
    return await this.projectRepository.save(
      this.projectRepository.create({
        ...project,
        user: {
          id: user.id,
        },
      }),
    );
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
    const project = await this.projectRepository.find({
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

    await this.projectRepository.delete(projectId);
  }
}
