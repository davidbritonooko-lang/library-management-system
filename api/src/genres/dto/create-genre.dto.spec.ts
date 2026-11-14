import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto.js';
import { UpdateGenreDto } from './update-genre.dto.js';

describe('Genre DTO validation', () => {
  it('accepts a valid genre payload', async () => {
    const dto = plainToInstance(CreateGenreDto, {
      name: 'Science Fiction',
      slug: 'science-fiction',
    });
    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects a missing name or malformed slug', async () => {
    const dto = plainToInstance(CreateGenreDto, { slug: 'Not A Slug' });
    const errors = await validate(dto);
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['name', 'slug']),
    );
  });

  it('allows a valid partial genre update', async () => {
    const dto = plainToInstance(UpdateGenreDto, { name: 'New Genre Name' });
    await expect(validate(dto)).resolves.toHaveLength(0);
  });
});
