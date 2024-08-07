import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
import { User } from '../../entities';
import { GetUser } from '../../decorators/get-user.decorator';
import {
  CreateParagraphRequest,
  CreateProjectRequest,
  UpdateParagraphRequest,
} from './dto';
import { IsUuidParam } from '../../validators';
import { PermissionsGuard } from '../../guards';

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

  @Get(':id')
  public async getProjectById(
    @IsUuidParam('id') projectId: string,
    @GetUser() loggedUser: User,
  ) {
    return await this.projectService.getProjectById(loggedUser, projectId);
  }

  @Delete(':id')
  public async delete(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') projectId: string,
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

  @Patch(':id/paragraphs/:paragraphId')
  public async updateParagraph(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') projectId: string,
    @IsUuidParam('paragraphId') paragraphId: string,
    @Body() paragraph: UpdateParagraphRequest,
  ) {
    return await this.projectService.updateParagraph(
      loggedUser,
      projectId,
      paragraphId,
      paragraph,
    );
  }

  @Post(':id/paragraphs/:paragraphId/preview')
  @UseGuards(PermissionsGuard)
  public async generatePreview(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') projectId: string,
    @IsUuidParam('paragraphId') paragraphId: string,
  ) {
    return await this.projectService.generatePreview(
      loggedUser,
      projectId,
      paragraphId,
    );
  }

  @Patch(':id/paragraphs/:paragraphId/audios/:audioId')
  public async selectAudio(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') projectId: string,
    @IsUuidParam('paragraphId') paragraphId: string,
    @IsUuidParam('audioId') audioId: string,
  ) {
    return await this.projectService.selectAudio(
      loggedUser,
      projectId,
      paragraphId,
      audioId,
    );
  }
}
