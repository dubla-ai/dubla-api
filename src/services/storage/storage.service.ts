import { Injectable } from '@nestjs/common';
import { IStorageService } from './storage.service.interface';
import { S3Provider } from '../../providers/s3/s3.provider';

@Injectable()
export class StorageService implements IStorageService {
  constructor(private readonly s3Provider: S3Provider) {}
  async upload(file: Buffer, fileName: string): Promise<string> {
    return await this.s3Provider.uploadFile(file, fileName);
  }

  async download(key: string): Promise<Buffer> {
    return await this.s3Provider.download(key);
  }

  async getSignedUrl(key: string): Promise<string> {
    return await this.s3Provider.getSignedUrl(key);
  }
}
