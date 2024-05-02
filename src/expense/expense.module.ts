import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './entities/expense.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtUtilService } from '../common/services/jwt-util/jwt-util.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, JwtUtilService],
})
export class ExpenseModule {}
