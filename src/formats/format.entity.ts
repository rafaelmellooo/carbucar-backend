import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/products/product.entity';

@Entity()
export class Format {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => Product,
    product => product.format,
  )
  products: Product[];
}
