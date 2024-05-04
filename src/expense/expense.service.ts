import { Injectable, Logger } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { FiltersDto } from './dto/filters.dto';

@Injectable()
export class ExpenseService {
  private readonly logger: Logger;
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
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
  async getByUserId(userId: string): Promise<Expense[]> {
    try {
      return await this.expenseModel
        .find({ userId: userId })
        .sort({ date: -1 })
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

  async getStats(data: FiltersDto) {
    const { userId, dateFrom, dateTo } = data;
    const match =
      dateFrom && dateTo
        ? {
            $match: {
              userId,
              date: {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo),
              },
            },
          }
        : {
            $match: {
              userId,
            },
          };
    try {
      const totalAmount = await this.expenseModel.aggregate([
        match,
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
      ]);
      const totalAmountByCategory = await this.expenseModel.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        match,
        {
          $group: {
            _id: '$category._id',
            totalAmount: { $sum: '$amount' },
            category: { $first: '$category.title' },
          },
        },
        {
          $sort: {
            category: 1,
          },
        },
        {
          $project: {
            totalAmount: 1,
            _id: 0,
            category: { $arrayElemAt: ['$category', 0] }, // Get the first element from category array (category document)
          },
        },
      ]);
      return {
        totalAmount: totalAmount[0].totalAmount,
        totalAmountByCategory,
      };
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
