import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { resolve } from 'path';
import { randomBytes } from 'crypto';
import { DeleteResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(
    @Query('wires') wires: number,
    @Query('height') height: string,
    @Query('width') width: string,
    @Query('format') format: number,
    @Query('page') page = 1,
  ): Promise<Pagination<Product>> {
    const [min_height, max_height] = height
      ? height.split(',').map(height => Number(height.trim()))
      : [];

    const [min_width, max_width] = width
      ? width.split(',').map(width => Number(width.trim()))
      : [];

    return this.productsService.findAll(
      wires,
      !!height,
      min_height,
      max_height,
      !!width,
      min_width,
      max_width,
      format,
      {
        page,
        limit: 9,
      },
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() product: Product): Promise<Product> {
    return this.productsService.create(product);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':id/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, callback) => {
          const hash = randomBytes(6).toString('hex');

          const fileName = `${hash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),
    }),
  )
  upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    return this.productsService.upload(id, file);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(@Param('id') id: string, @Body() product: Product): Promise<Product> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.productsService.delete(id);
  }
}
