import { BooksService } from './books.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FindBooksQueryDto } from './dto/find-books-query.dto.js';

describe('BooksService', () => {
  const prisma = {
    genre: { findUnique: vi.fn() },
    book: { findMany: vi.fn(), count: vi.fn() },
    $transaction: vi.fn((queries: Promise<unknown>[]) => Promise.all(queries)),
  };
  let service: BooksService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BooksService(prisma as unknown as PrismaService);
  });

  it('builds genre and case-insensitive title/author filters with pagination', async () => {
    prisma.book.findMany.mockResolvedValue([{ id: 'book-1' }]);
    prisma.book.count.mockResolvedValue(21);

    const query = Object.assign(new FindBooksQueryDto(), {
      genreId: '9c8c7e80-8d9d-4db3-8f08-7e7df7b2a5b9',
      search: 'asimov',
      page: 3,
      limit: 5,
    });

    const result = await service.findAll(query);

    expect(prisma.book.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          genreId: query.genreId,
          OR: [
            { title: { contains: 'asimov', mode: 'insensitive' } },
            { author: { contains: 'asimov', mode: 'insensitive' } },
          ],
        },
        skip: 10,
        take: 5,
      }),
    );
    expect(prisma.book.count).toHaveBeenCalledWith({
      where: expect.objectContaining({ genreId: query.genreId }),
    });
    expect(result.meta).toEqual({
      total: 21,
      page: 3,
      limit: 5,
      totalPages: 5,
    });
  });

  it('returns default pagination when page and limit are omitted', async () => {
    prisma.book.findMany.mockResolvedValue([]);
    prisma.book.count.mockResolvedValue(0);

    const result = await service.findAll(new FindBooksQueryDto());

    expect(prisma.book.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 10 }),
    );
    expect(result.meta).toEqual({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  });
});
