import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { Auth } from '../common/decorators/auth.decorator';
import { FiltersDto } from './dto/filters.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  findAll() {
    return this.expenseService.findAll();
  }

  @Post('GetByUserId')
  // @Auth()
  getByUserId(@Body() body: FiltersDto) {
    return this.expenseService.getByUserId(body);
  }

  @Get('GetById/:id')
  // @Auth()
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.expenseService.findOne(id);
  }

  @Post('GetTotals')
  // @Auth()
  getTotals(@Body() data: FiltersDto) {
    return this.expenseService.getTotals(data);
  }

  @Patch(':id')
  // @Auth()
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.expenseService.remove(id);
  }
}
