import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findById(id: number): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  create(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  }

  async upload(id: number, file: Express.Multer.File): Promise<Product> {
    const product = await this.productsRepository.findOne(id);

    product.image = file.filename;

    return this.productsRepository.save(product);
  }
}
