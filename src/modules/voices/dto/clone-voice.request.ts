import { IsNotEmpty } from 'class-validator';

export class CloneVoiceRequest {
  @IsNotEmpty()
  name: string;
}
