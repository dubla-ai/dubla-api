import { Global, Module } from '@nestjs/common';
import { STORAGE_SERVICE } from '../services';
import { StorageService } from './storage.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: StorageService,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
