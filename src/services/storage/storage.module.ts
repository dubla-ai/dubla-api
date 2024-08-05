import { Global, Module } from '@nestjs/common';
import { STORAGE_SERVICE } from '../services';
import { StorageService } from './storage.service';
import { S3Provider } from '../../providers/s3/s3.provider';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: StorageService,
    },
    S3Provider,
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
