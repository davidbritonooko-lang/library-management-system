import { ConflictException, NotFoundException } from '@nestjs/common';
import { GenresService } from './genres.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('GenresService', () => {
  const prisma = {
    genre: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  let service: GenresService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new GenresService(prisma as unknown as PrismaService);
  });

  it('creates a genre', async () => {
    const dto = { name: 'Mystery', slug: 'mystery' };
    prisma.genre.create.mockResolvedValue({ id: 'genre-1', ...dto });

    await expect(service.create(dto)).resolves.toEqual({
      id: 'genre-1',
      ...dto,
    });
    expect(prisma.genre.create).toHaveBeenCalledWith({ data: dto });
  });

  it('maps duplicate genre names or slugs to a conflict response', async () => {
    prisma.genre.create.mockRejectedValue({ code: 'P2002' });

    await expect(
      service.create({ name: 'Mystery', slug: 'mystery' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns not found when updating a missing genre', async () => {
    prisma.genre.findUnique.mockResolvedValue(null);

    await expect(
      service.update('missing', { name: 'New name' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
