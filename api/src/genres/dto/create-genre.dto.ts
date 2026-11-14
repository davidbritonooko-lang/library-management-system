import { IsString, Length, Matches } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsString()
  @Length(2, 80)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must contain lowercase letters, numbers, and single hyphens',
  })
  slug!: string;
}
