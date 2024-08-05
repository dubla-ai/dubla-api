import { Global, Module } from '@nestjs/common';
import { AUDIO_SCRIPT_SERVICE } from '../services';
import { AudioScriptService } from './audio-script.service';
import { ResembleProvider } from '../../providers/resemble/resemble.provider';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: AUDIO_SCRIPT_SERVICE,
      useClass: AudioScriptService,
    },
    ResembleProvider,
  ],
  exports: [AUDIO_SCRIPT_SERVICE],
})
export class AudioScriptModule {}
