import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './entities/expense.entity';
import { ConfigModule } from '@nestjs/config';
// import { JwtUtilService } from '../common/services/jwt-util/jwt-util.service';
import {
  UserSetting,
  UserSettingSchema,
} from '../user-settings/entities/user-setting.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: UserSetting.name, schema: UserSettingSchema },
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
