import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';

@Controller('product-categories')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getAllProductCategories() {
    return this.productCategoriesService.getAllProductCategory();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProductCategories(
    @Body() productCategory: CreateProductCategoryDto,
  ) {
    return this.productCategoriesService.createProductCategory(productCategory);
  }
}
