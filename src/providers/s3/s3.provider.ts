import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Provider {
  private logger = new Logger(S3Provider.name);
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  public async uploadFile(
    fileContent: Buffer,
    fileName: string,
  ): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
    };

    try {
      const response = await this.s3.upload(params).promise();
      return response.Location;
    } catch (err) {
      this.logger.error(`Error uploading file: ${err.message}`);
      throw err;
    }
  }

  async download(s3Key: string): Promise<Buffer> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      console.log(`File downloaded successfully.`);
      return data.Body as Buffer;
    } catch (err) {
      console.error(`Error downloading file: ${err.message}`);
      throw err;
    }
  }

  async getSignedUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Expires: expiresIn,
    };

    try {
      return await this.s3.getSignedUrl('getObject', params);
    } catch (err) {
      this.logger.error(`Error generating signed URL: ${err.message}`);
      throw err;
    }
  }
}
