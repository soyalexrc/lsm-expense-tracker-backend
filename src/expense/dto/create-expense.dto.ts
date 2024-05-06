import {IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  title: string;

  // @IsDate()
  @IsString()
  date: Date;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  paymentMethod: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  userId: string;
}
