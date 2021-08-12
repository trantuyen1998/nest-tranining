import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ProductCategory from './productCategory.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async getAllProductCategory() {
    return this.productCategoriesRepository.find();
  }

  async createProductCategory(productCategory: CreateProductCategoryDto) {
    const newProductCategory = await this.productCategoriesRepository.create(
      productCategory,
    );
    await this.productCategoriesRepository.save(newProductCategory);
    return newProductCategory;
  }
}
