import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
import { User } from '../../entities';
import { GetUser } from '../../decorators/get-user.decorator';
import { CreateProjectRequest } from './dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  public async create(
    @GetUser() loggedUser: User,
    project: CreateProjectRequest,
  ) {
    return await this.projectService.create(loggedUser, project);
  }

  @Get()
  public async get(@GetUser() loggedUser: User) {
    return await this.projectService.getAll(loggedUser);
  }

  @Delete(':projectId')
  public async delete(
    @GetUser() loggedUser: User,
    @Param('projectId') projectId: string,
  ) {
    await this.projectService.delete(loggedUser, projectId);
  }
}
