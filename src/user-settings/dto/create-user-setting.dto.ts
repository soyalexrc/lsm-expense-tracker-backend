import { IsArray, IsString } from 'class-validator';
import { PaymentMethod } from '../entities/user-setting.entity';

export class CreateUserSettingDto {
  @IsString()
  userId: string;

  @IsArray()
  paymentMethods: PaymentMethod[];
}
