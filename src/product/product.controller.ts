import { CreateProductDto } from './dto/createProduct.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() product: CreateProductDto) {
    return this.productService.createProduct(product);
  }
}
