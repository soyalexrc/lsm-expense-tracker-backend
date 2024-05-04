import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";

export type UserSettingDocument = HydratedDocument<UserSetting>;

export interface PaymentMethod {
  title: string;
  _id: mongoose.Types.ObjectId;
}

@Schema()
export class UserSetting {
  @Prop()
  title: string;

  @Prop()
  userId: string;

  @Prop()
  paymentMethods: PaymentMethod[];
}

export const UserSettingSchema = SchemaFactory.createForClass(UserSetting);
