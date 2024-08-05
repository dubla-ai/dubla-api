import { IsOptional } from 'class-validator';

export class UpdateUserRequestDto {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  userOrigin: string;

  @IsOptional()
  password: string;

  @IsOptional()
  confirmPassword: string;
}
