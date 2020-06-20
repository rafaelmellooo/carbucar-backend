import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';
import { Format } from 'src/formats/format.entity';

@Entity()
export class Product {
  @PrimaryColumn()
  id: number;

  @Column()
  height: number;

  @Column()
  width: number;

  @Exclude()
  @Column({ nullable: true })
  image: string;

  @Expose()
  get image_url(): string {
    return `http://localhost:3333/uploads/${this.image}`;
  }

  @ManyToOne(
    () => Format,
    format => format.products,
  )
  format: Format;
}
