import {
  Controller,
  Get,
  Body,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FormatsService } from './formats.service';
import { Format } from './format.entity';

@Controller('formats')
export class FormatsController {
  constructor(private readonly formatsService: FormatsService) {}

  @Get()
  findAll(): Promise<Format[]> {
    return this.formatsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() format: Format): Promise<Format> {
    return this.formatsService.create(format);
  }
}
