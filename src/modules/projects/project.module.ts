import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audio, Paragraph, Project, Voice } from '../../entities';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { AudioScriptModule } from '../../services/audio-script/audio-script.module';
import { StorageModule } from '../../services/storage/storage.module';
import { AudioManagerProvider } from '../../providers/audio-manager/audio-manager.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Voice, Paragraph, Audio]),
    AudioScriptModule,
    StorageModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, AudioManagerProvider],
})
export class ProjectModule {}
