import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  cpf: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  userOrigin: string;
}
