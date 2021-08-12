import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import ProductCategory from '../product-categories/productCategory.entity';
import { CarProperties } from './interfaces/carProperties.interface';
import { BookProperties } from './interfaces/bookProperties.interface';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.products,
  )
  public category: ProductCategory;

  @Column({
    type: 'jsonb',
  })
  public properties: CarProperties | BookProperties;
}

export default Product;
