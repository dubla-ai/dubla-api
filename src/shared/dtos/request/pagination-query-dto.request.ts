import { IsOptional, IsString, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDateFormat } from '../../../validators';
import { OrderStatusEnum } from '../../../entities/order-status.entity';

export class PaginationQueryRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  orderBy: string = 'recent';

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  status: OrderStatusEnum;

  @IsOptional()
  @IsDateFormat({
    message: 'startDate must be a valid date in the format YYYY-MM-DD',
  })
  startDate: string;

  @IsOptional()
  @IsDateFormat({
    message: 'endDate must be a valid date in the format YYYY-MM-DD',
  })
  endDate: string;

  @IsOptional()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  shoppingName: string;
}
