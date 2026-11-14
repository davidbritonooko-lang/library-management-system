import {
  IsISBN,
  IsInt,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(1, 200)
  title!: string;

  @IsString()
  @Length(1, 160)
  author!: string;

  @IsISBN()
  isbn!: string;

  @IsInt()
  @Min(1)
  @Max(100000)
  totalCopies!: number;

  @IsUUID()
  genreId!: string;
}
