export interface IStorageService {
  upload(file: Buffer, fileName: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  getSignedUrl(key: string): Promise<string>;
}
