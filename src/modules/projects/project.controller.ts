import {
  Body,
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
import { CreateParagraphRequest, CreateProjectRequest } from './dto';
import { IsUuidParam } from '../../validators';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  public async create(
    @GetUser() loggedUser: User,
    @Body() project: CreateProjectRequest,
  ) {
    return await this.projectService.create(loggedUser, project);
  }

  @Get()
  public async get(@GetUser() loggedUser: User) {
    return await this.projectService.getAll(loggedUser);
  }

  @Delete(':id')
  public async delete(
    @GetUser() loggedUser: User,
    @Param('id') projectId: string,
  ) {
    await this.projectService.delete(loggedUser, projectId);
  }

  @Get(':id/paragraphs')
  public async getParagraphs(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') projectId: string,
  ) {
    return await this.projectService.getParagraphs(loggedUser, projectId);
  }

  @Post(':id/paragraphs')
  public async createParagraph(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') projectId: string,
    @Body() paragraph: CreateParagraphRequest,
  ) {
    return await this.projectService.createParagraph(
      loggedUser,
      projectId,
      paragraph,
    );
  }
}
