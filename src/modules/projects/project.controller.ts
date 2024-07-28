import {
    Controller,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
  
  @Controller('projects')
  @UseGuards(JwtAuthGuard)
  export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

  }
  