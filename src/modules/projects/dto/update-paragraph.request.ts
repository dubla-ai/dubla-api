import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateParagraphRequest {
  @IsUUID()
  @IsOptional()
  voiceId: string;

  @IsOptional()
  @MinLength(1)
  @MaxLength(2000)
  body: string;
}
