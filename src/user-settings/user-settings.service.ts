import { Injectable } from '@nestjs/common';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentMethod, UserSetting } from './entities/user-setting.entity';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectModel(UserSetting.name) private userSettingModel: Model<UserSetting>,
  ) {}

  create(createUserSettingDto: CreateUserSettingDto) {
    return 'This action adds a new userSetting';
  }

  async getByUserId(userId: string) {
    const update = {
      $setOnInsert: { userId: userId, paymentMethods: [] },
    };
    const options = { upsert: true, new: true };
    try {
      return await this.userSettingModel.findOneAndUpdate(
        { userId },
        update,
        options,
      );
    } catch (e) {
      console.log(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} userSetting`;
  }

  async update(id: string, updateUserSettingDto: UpdateUserSettingDto) {
    const paymentMethods: PaymentMethod[] =
      updateUserSettingDto.paymentMethods.map((paymentMethod) => {
        if (!paymentMethod._id) {
          return {
            ...paymentMethod,
            _id: new mongoose.Types.ObjectId(),
          };
        }
        return paymentMethod;
      });
    try {
      const userSetting = await this.userSettingModel.findById(id);
      if (!userSetting) {
        return {
          error: true,
          message: `No se encontro un registro con el id: ${id}`,
        };
      }
      const updatedUserSetting = await userSetting.updateOne({
        ...updateUserSettingDto,
        paymentMethods,
      });
      if (updatedUserSetting.acknowledged) {
        return {
          message: 'Se actualizo el registro con exito!',
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userSetting`;
  }
}
