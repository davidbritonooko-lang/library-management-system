import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

function hasPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name.trim(),
          email: dto.email.toLowerCase(),
          passwordHash,
          role: Role.PATRON,
        },
        select: { id: true, name: true, email: true, role: true },
      });
      return this.issueToken(user);
    } catch (error) {
      if (hasPrismaCode(error, 'P2002')) {
        throw new ConflictException('An account with this email already exists');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    let passwordMatches = false;
    if (user?.passwordHash?.startsWith('$2')) {
      passwordMatches = await bcrypt
        .compare(dto.password, user.passwordHash)
        .catch(() => false);
    }

    if (!passwordMatches || !user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  private async issueToken(user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: '1h',
      user,
    };
  }
}
