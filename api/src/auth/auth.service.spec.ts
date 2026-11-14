import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const prisma = { user: { create: vi.fn(), findUnique: vi.fn() } };
  const jwtService = { signAsync: vi.fn() };
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
    );
    jwtService.signAsync.mockResolvedValue('signed.jwt.token');
  });

  it('hashes patron passwords and returns a signed access token', async () => {
    const user = {
      id: 'user-1',
      name: 'Test Patron',
      email: 'patron@example.com',
      role: Role.PATRON,
    };
    prisma.user.create.mockResolvedValue(user);

    const result = await service.register({
      name: 'Test Patron',
      email: 'PATRON@example.com',
      password: 'correct-horse-battery',
    });

    const createArgs = prisma.user.create.mock.calls[0][0] as {
      data: { passwordHash: string; role: Role; email: string };
    };
    expect(createArgs.data.passwordHash).not.toBe('correct-horse-battery');
    expect(createArgs.data.passwordHash.startsWith('$2')).toBe(true);
    await expect(
      bcrypt.compare('correct-horse-battery', createArgs.data.passwordHash),
    ).resolves.toBe(true);
    expect(createArgs.data.role).toBe(Role.PATRON);
    expect(createArgs.data.email).toBe('patron@example.com');
    expect(result.access_token).toBe('signed.jwt.token');
    expect(result.user).toEqual(user);
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects incorrect passwords with a generic unauthorized response', async () => {
    const passwordHash = await bcrypt.hash('a-different-password', 4);
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Test Patron',
      email: 'patron@example.com',
      role: Role.PATRON,
      passwordHash,
    });

    await expect(
      service.login({
        email: 'patron@example.com',
        password: 'incorrect-password',
      }),
    ).rejects.toMatchObject({ status: 401 });
  });
});
