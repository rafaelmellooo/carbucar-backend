import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Format } from './format.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormatsService {
  constructor(
    @InjectRepository(Format)
    private readonly formatsRepository: Repository<Format>,
  ) {}

  findAll(): Promise<Format[]> {
    return this.formatsRepository.find({
      cache: 60000,
    });
  }

  create(format: Format): Promise<Format> {
    return this.formatsRepository.save(format);
  }
}
