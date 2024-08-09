import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VoiceService } from './voice.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../entities';
import { GetUser } from '../../decorators/get-user.decorator';
import { CloneVoiceRequest, GetVoicesRequest } from './dto';
import { IsUuidParam } from '../../validators';

@Controller('voices')
@UseGuards(JwtAuthGuard)
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get()
  public async get(
    @GetUser() loggedUser: User,
    @Query() query: GetVoicesRequest,
  ) {
    return await this.voiceService.getAll(loggedUser, query);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async clone(
    @GetUser() loggedUser: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() cloneVoice: CloneVoiceRequest,
  ) {
    return await this.voiceService.clone(loggedUser, file, cloneVoice);
  }

  @Patch(':id')
  public async edit(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') voiceId: string,
    @Body() voice: CloneVoiceRequest,
  ) {
    return await this.voiceService.edit(loggedUser, voice, voiceId);
  }

  @Delete(':id')
  public async delete(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') voiceId: string,
  ) {
    return await this.voiceService.delete(loggedUser, voiceId);
  }
}
