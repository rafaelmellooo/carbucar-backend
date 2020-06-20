import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { FormatsModule } from './formats/formats.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ProductsModule, FormatsModule],
})
export class AppModule {}
