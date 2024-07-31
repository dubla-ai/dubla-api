import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectRequest {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
