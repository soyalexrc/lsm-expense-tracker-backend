import { Injectable, Logger } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { FiltersDto } from './dto/filters.dto';
import { UserSetting } from '../user-settings/entities/user-setting.entity';

@Injectable()
export class ExpenseService {
  private readonly logger: Logger;
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(UserSetting.name) private userSettingModel: Model<UserSetting>,
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
  async getByUserId(filters: FiltersDto): Promise<Expense[]> {
    const { userId, dateFrom, dateTo, categoryId, paymentMethod, title } = filters;
    try {
      const query: any = { userId: userId };

      // Add filters based on provided values
      if (dateFrom && dateTo) {
        query.date = { $gte: dateFrom, $lte: dateTo }; // Filter by date range
      }
      if (categoryId) {
        query.category = categoryId; // Filter by category
      }
      if (paymentMethod) {
        query.paymentMethod = paymentMethod; // Filter by payment method
      }
      if (title) {
        query.title = { $regex: new RegExp(title, 'i') }; // Filter by title (case-insensitive)
      }
      return await this.expenseModel
        .find(query)
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

  async getTotals(data: FiltersDto) {
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
      const settings = await this.userSettingModel.findOne({ userId });
      const totalAmount = await this.expenseModel.aggregate([
        match,
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
        { $project: { totalAmount: { $round: ['$totalAmount', 2] } } },
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
            value: { $sum: '$amount' },
            name: { $first: '$category.title' },
            color: { $first: '$category.color' },
          },
        },
        {
          $sort: {
            name: 1,
          },
        },
        {
          $project: {
            value: { $round: ['$value', 2] },
            _id: 0,
            color: { $arrayElemAt: ['$color', 0] },
            name: { $arrayElemAt: ['$name', 0] }, // Get the first element from category array (category document)
          },
        },
      ]);
      const totalAmountByDay = await this.expenseModel.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(dateFrom),
              $lte: new Date(dateTo),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $project: {
            date: '$_id',
            _id: 0,
            totalAmount: { $round: ['$totalAmount', 2] },
          },
        },
        { $sort: { date: 1 } },
      ]);
      const totalByPaymentMethod = await this.expenseModel.aggregate([
        match,
        {
          $group: {
            _id: '$paymentMethod',
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $project: {
            totalAmount: { $round: ['$totalAmount', 2] },
            _id: 1,
          },
        },
      ]);
      const totalAmountByPaymentMethod = this.mergePaymentData(
        settings?.paymentMethods,
        totalByPaymentMethod,
      );
      return {
        totalAmount: totalAmount[0]?.totalAmount ?? 0,
        totalAmountByCategory,
        totalAmountByDay,
        totalAmountByPaymentMethod,
      };
    } catch (e) {
      this.logger.error('here', e);
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

  private mergePaymentData(paymentMethods, totalByPaymentMethod) {
    // Create a map for efficient lookup by _id
    const totalMap: Map<string, number> = new Map();
    for (const item of totalByPaymentMethod) {
      totalMap.set(item._id, item.totalAmount);
    }

    // Merge payment methods with total amounts
    const mergedData = [];
    for (const method of paymentMethods) {
      const totalAmount = totalMap.get(method._id) || 0; // Use 0 if no matching total is found
      mergedData.push({ title: method.title, totalAmount });
    }

    return mergedData;
  }
}
