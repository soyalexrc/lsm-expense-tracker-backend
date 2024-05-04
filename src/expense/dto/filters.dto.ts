import { IsOptional, IsString } from 'class-validator';

export class FiltersDto {
  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  expenseName: string;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  dateFrom: string;

  @IsString()
  @IsOptional()
  dateTo: string;
}
