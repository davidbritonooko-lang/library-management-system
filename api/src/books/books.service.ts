import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { FindBooksQueryDto } from './dto/find-books-query.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

function hasPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: dto.genreId },
      select: { id: true },
    });
    if (!genre) throw new NotFoundException('The selected genre was not found');

    try {
      return await this.prisma.book.create({
        data: {
          title: dto.title,
          author: dto.author,
          isbn: dto.isbn,
          totalCopies: dto.totalCopies,
          availableCopies: dto.totalCopies,
          genreId: dto.genreId,
        },
        include: { genre: true },
      });
    } catch (error) {
      if (hasPrismaCode(error, 'P2002')) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw error;
    }
  }

  async findAll(query: FindBooksQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.BookWhereInput = {};

    if (query.genreId) where.genreId = query.genreId;
    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy: [{ title: 'asc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} was not found`);
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one book field must be provided');
    }
    const existing = await this.findOne(id);

    if (dto.genreId) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: dto.genreId },
        select: { id: true },
      });
      if (!genre) throw new NotFoundException('The selected genre was not found');
    }

    const data: Prisma.BookUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.author !== undefined) data.author = dto.author;
    if (dto.isbn !== undefined) data.isbn = dto.isbn;
    if (dto.genreId !== undefined) data.genreId = dto.genreId;

    if (dto.totalCopies !== undefined) {
      const borrowedCopies = existing.totalCopies - existing.availableCopies;
      const nextAvailableCopies = dto.totalCopies - borrowedCopies;
      if (nextAvailableCopies < 0) {
        throw new BadRequestException(
          'totalCopies cannot be lower than the number of currently borrowed copies',
        );
      }
      data.availableCopies = nextAvailableCopies;
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: { genre: true },
      });
    } catch (error) {
      if (hasPrismaCode(error, 'P2002')) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}
