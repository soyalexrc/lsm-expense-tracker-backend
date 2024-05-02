import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryDto } from "../category/dto/update-category.dto";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ExpenseService {
  private readonly logger: Logger;
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private jwtService: JwtService,
  ) {}
  async create(createExpenseDto: CreateExpenseDto) {
    try {
      const expense = new this.expenseModel(createExpenseDto);
      return await expense.save();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async findAll(): Promise<any> {
    try {
      const users = await clerkClient.users.getUserList();
      return {
        users,
      };
      // return await this.expenseModel.find({}).populate('category');
    } catch (e) {
      this.logger.error(e);
    }
  }
  async getByUserId(body: { token: string }): Promise<Expense[]> {
    const userId = this.jwtService.decode(body.token)?.sub;
    try {
      return await this.expenseModel
        .find({ userId: userId })
        .sort({ date: 1 })
        .populate('category');
    } catch (e) {
      this.logger.error(e);
    }
  }

  async findOne(id: string) {
    try {
      return await this.expenseModel.findById(id).populate('category');
    } catch (e) {
      this.logger.error(e);
    }
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    try {
      const expense = await this.expenseModel.findById(id);
      if (!expense) {
        return {
          error: true,
          message: `No se encontro un registro con el id: ${id}`,
        };
      }
      const updatedExpense = await expense.updateOne(updateExpenseDto);
      if (updatedExpense.acknowledged) {
        return {
          message: 'Se actualizo el registro con exito!',
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: string) {
    try {
      const expense = await this.expenseModel.findById(id);
      if (!expense) {
        return {
          error: true,
          message: `No se encontro un registro con el id: ${id}`,
        };
      }
      const deletedExpense = await expense.deleteOne({ id: id });
      if (deletedExpense.acknowledged) {
        return {
          message: 'Se elimino el registro con exito!',
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
}
