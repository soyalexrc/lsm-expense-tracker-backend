import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = new this.categoryModel(createCategoryDto);
      return await category.save();
    } catch (e) {
      console.log(e);
    }
  }

  async findAll() {
    try {
      return await this.categoryModel.find({});
    } catch (e) {
      console.log(e);
    }
  }

  async findOne(id: string) {
    try {
      return await this.categoryModel.findById(id);
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        return {
          error: true,
          message: `No se encontro una categoria con el id: ${id}`,
        };
      }
      const updatedCategory = await category.updateOne(updateCategoryDto);
      if (updatedCategory.acknowledged) {
        return {
          message: 'Se actualizo la categoria con exito!',
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoryModel.findById(id);
      if (!category) {
        return {
          error: true,
          message: `No se encontro una categoria con el id: ${id}`,
        };
      }
      const deletedCategory = await category.deleteOne({ id: id });
      if (deletedCategory.acknowledged) {
        return {
          message: 'Se elimino la categoria con exito!',
        };
      }
    } catch (e) {
      console.log(e);
    }
  }
}
