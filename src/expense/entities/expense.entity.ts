import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../../category/entities/category.entity';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
  @Prop()
  title: string;

  @Prop()
  date: Date;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop()
  description: string;

  @Prop()
  paymentMethod: string;

  @Prop()
  userId: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
