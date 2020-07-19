import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';
import { Format } from 'src/formats/format.entity';

@Entity()
export class Product {
  @IsNotEmpty({ message: 'O código do produto deve ser informado' })
  @IsString({ message: 'O código do produto deve ser alfanumérico' })
  @PrimaryColumn()
  id: string;

  @IsNotEmpty({ message: 'A altura do produto deve ser informada' })
  @IsNumber({}, { message: 'A altura do produto deve ser numérica' })
  @Column()
  height: number;

  @IsNotEmpty({ message: 'A largura do produto deve ser informada' })
  @IsNumber({}, { message: 'A largura do produto deve ser numérica' })
  @Column()
  width: number;

  @Exclude()
  @Column({ nullable: true })
  image: string;

  @Expose()
  get image_url(): string {
    return this.image ? `http://localhost:3333/uploads/${this.image}` : null;
  }

  @IsNotEmpty({ message: 'A quantidade de fios deve ser informada' })
  @IsNumber({}, { message: 'A quantidade de fios deve ser numérica' })
  @Column()
  wires: number;

  @IsNotEmpty({ message: 'O formato do produto deve ser informado' })
  @IsInt()
  @ManyToOne(
    () => Format,
    format => format.products,
  )
  format: Format;
}
