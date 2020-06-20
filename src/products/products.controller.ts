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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findById(@Param('id') id: number): Promise<Product> {
    return this.productsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() product: Product): Promise<Product> {
    return this.productsService.create(product);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':id/upload')
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
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    return this.productsService.upload(id, file);
  }
}
