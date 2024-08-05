import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateParagraphRequest {
  @IsUUID()
  @IsNotEmpty()
  voiceId: string;

  @IsNotEmpty()
  body: string;
}
