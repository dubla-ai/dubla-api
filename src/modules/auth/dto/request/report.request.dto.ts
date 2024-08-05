import { IsNotEmpty } from 'class-validator';
import { IsDateFormat } from '../../../../validators';

export class GetDashboardRequest {
  @IsDateFormat()
  @IsNotEmpty()
  startDate: string;

  @IsDateFormat()
  @IsNotEmpty()
  endDate: string;
}
