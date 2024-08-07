import { IsOptional } from 'class-validator';

export class UpdateProjectRequest {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;
}
