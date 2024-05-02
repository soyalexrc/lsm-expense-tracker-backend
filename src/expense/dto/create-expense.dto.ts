import { IsNumber, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  title: string;

  @IsString()
  token: string;

  // @IsDate()
  @IsString()
  date: Date;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  userId: string;
}
