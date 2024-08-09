import { IsOptional } from 'class-validator';

export class GetVoicesRequest {
  @IsOptional()
  allVoices: boolean;

  @IsOptional()
  search: string;
}
