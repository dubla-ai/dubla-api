import { IsOptional } from 'class-validator';

export class UpdateUserRequestDto {
  name: string;
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  confirmPassword: string;
}
