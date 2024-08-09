import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VoiceService } from './voice.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../entities';
import { GetUser } from '../../decorators/get-user.decorator';
import { CloneVoiceRequest } from './dto';
import { IsUuidParam } from '../../validators';

@Controller('voices')
@UseGuards(JwtAuthGuard)
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get()
  public async get(@GetUser() loggedUser: User) {
    return await this.voiceService.getAll(loggedUser);
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

  @Delete(':id')
  public async delete(
    @GetUser() loggedUser: User,
    @IsUuidParam('id') voiceId: string,
  ) {
    return await this.voiceService.delete(loggedUser, voiceId);
  }
}
