import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

function hasPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({ data: dto });
    } catch (error) {
      if (hasPrismaCode(error, 'P2002')) {
        throw new ConflictException('A genre with this name or slug already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { books: true } } },
    });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });
    if (!genre) throw new NotFoundException(`Genre ${id} was not found`);
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one genre field must be provided');
    }
    await this.findOne(id);
    try {
      return await this.prisma.genre.update({ where: { id }, data: dto });
    } catch (error) {
      if (hasPrismaCode(error, 'P2002')) {
        throw new ConflictException('A genre with this name or slug already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      return await this.prisma.genre.delete({ where: { id } });
    } catch (error) {
      if (hasPrismaCode(error, 'P2003')) {
        throw new ConflictException('Cannot delete a genre while books reference it');
      }
      throw error;
    }
  }
}
