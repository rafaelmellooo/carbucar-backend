import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path';
import { unlinkSync } from 'fs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(
    wires: number,
    height: boolean,
    min_height: number,
    max_height: number,
    width: boolean,
    min_width: number,
    max_width: number,
    sort_by = 'id',
    format: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    const products = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.format', 'format');

    const productsWithFormat = format
      ? products.andWhere('product.format = :format', { format })
      : products;

    const productsWithWidth = width
      ? productsWithFormat.andWhere(
          'product.width BETWEEN :min_width AND :max_width',
          { min_width, max_width },
        )
      : productsWithFormat;

    const productsWithHeight = height
      ? productsWithWidth.andWhere(
          'product.height BETWEEN :min_height AND :max_height',
          { min_height, max_height },
        )
      : productsWithWidth;

    const productsWithWires = wires
      ? productsWithHeight.andWhere('product.wires = :wires', { wires })
      : productsWithHeight;

    return paginate<Product>(
      productsWithWires.orderBy(`product.${sort_by}`, 'DESC'),
      options,
    );
  }

  create(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  }

  async upload(id: string, file: Express.Multer.File): Promise<Product> {
    const product = await this.productsRepository.findOneOrFail(id);

    product.image = file.filename;

    return this.productsRepository.save(product);
  }

  async update(id: string, product: Product, has_newimage: boolean): Promise<Product> {
    const oldProduct = await this.productsRepository.findOneOrFail(id);

    if (has_newimage) {
      if (oldProduct.image) {
        unlinkSync(
          resolve(__dirname, '..', '..', 'tmp', 'uploads', oldProduct.image),
        );

        oldProduct.image = null
      }
    }

    const newProduct = this.productsRepository.merge(oldProduct, product);

    return this.productsRepository.save(newProduct);
  }

  async delete(id: string): Promise<DeleteResult> {
    const oldProduct = await this.productsRepository.findOneOrFail(id);

    if (oldProduct.image) {
      unlinkSync(
        resolve(__dirname, '..', '..', 'tmp', 'uploads', oldProduct.image),
      );
    }

    return this.productsRepository.delete(id);
  }
}
