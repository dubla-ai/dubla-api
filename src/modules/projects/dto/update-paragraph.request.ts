import { IsOptional, IsUUID } from 'class-validator';

export class UpdateParagraphRequest {
  @IsUUID()
  @IsOptional()
  voiceId: string;

  @IsOptional()
  body: string;
}
