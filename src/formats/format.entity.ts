import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Format {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'O nome do formato deve ser informado' })
  @IsString({ message: 'O nome do formato deve ser alfanumérico' })
  @Column()
  name: string;

  @OneToMany(
    () => Product,
    product => product.format,
  )
  products: Product[];
}
