import { IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateParagraphRequest {
  @IsUUID()
  @IsNotEmpty()
  voiceId: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  body: string;
}
