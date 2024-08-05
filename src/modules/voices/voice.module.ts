import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voice } from '../../entities';
import { AudioScriptModule } from '../../services/audio-script/audio-script.module';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voice]), AudioScriptModule],
  controllers: [VoiceController],
  providers: [VoiceService],
})
export class VoiceModule {}
