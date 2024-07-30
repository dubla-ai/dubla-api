import { PaginationQueryRequestDto } from '../request/pagination-query-dto.request';

export class PaginationResponseDto {
  filter: PaginationQueryRequestDto;
  totalCount: number;
  page: number;
  data: any[];
}
