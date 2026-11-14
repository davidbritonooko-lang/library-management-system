import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateBookDto } from './create-book.dto.js';
import { UpdateBookDto } from './update-book.dto.js';
import { FindBooksQueryDto } from './find-books-query.dto.js';

describe('Book DTO validation', () => {
  it('accepts a valid book payload', async () => {
    const dto = plainToInstance(CreateBookDto, {
      title: 'The Mystery Library',
      author: 'A. Writer',
      isbn: '9780306406157',
      totalCopies: 4,
      genreId: '9c8c7e80-8d9d-4db3-8f08-7e7df7b2a5b9',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('requires validation decorators on every create-book field', async () => {
    const errors = await validate(plainToInstance(CreateBookDto, {}));
    expect(errors.map((error) => error.property).sort()).toEqual(
      ['author', 'genreId', 'isbn', 'title', 'totalCopies'].sort(),
    );
  });

  it('allows a partial update while validating supplied fields', async () => {
    const valid = plainToInstance(UpdateBookDto, { title: 'Updated title' });
    const invalid = plainToInstance(UpdateBookDto, { totalCopies: 0 });

    await expect(validate(valid)).resolves.toHaveLength(0);
    expect((await validate(invalid)).map((error) => error.property)).toContain(
      'totalCopies',
    );
  });

  it('transforms and validates pagination query values', async () => {
    const query = plainToInstance(FindBooksQueryDto, {
      page: '2',
      limit: '20',
    });

    expect(query.page).toBe(2);
    expect(query.limit).toBe(20);
    await expect(validate(query)).resolves.toHaveLength(0);
  });
});
