import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import { comparePassword } from 'src/common/utils/hash.util';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

const ACCESS_EXPIRATION = (process.env.JWT_ACCESS_EXPIRATION ||
  '15m') as JwtSignOptions['expiresIn'];
const REFRESH_EXPIRATION = (process.env.JWT_REFRESH_EXPIRATION ||
  '7d') as JwtSignOptions['expiresIn'];

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, userName, password } = loginDto;
    let user: User | null = null;

    if (!email && !userName) {
      throw new BadRequestException(
        'É necessário fornecer um e-mail ou nome de usuário para login.',
      );
    }
    if (email) {
      user = await this.prismaService.user.findUnique({
        where: { email },
      });
    } else if (userName) {
      user = await this.prismaService.user.findUnique({
        where: { username: userName },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await comparePassword(password, user.hashPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const tokens = await this.generateTokenPair(user);

    return {
      message: 'Login bem-sucedido',
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async refresh(refreshToken: string) {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token não é um refresh token.');
    }

    const storedToken = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token não encontrado.');
    }

    if (storedToken.revoked) {
      throw new UnauthorizedException('Refresh token foi revogado.');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expirado.');
    }

    await this.prismaService.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const user = await this.prismaService.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const tokens = await this.generateTokenPair(user);

    return {
      message: 'Tokens renovados com sucesso',
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    const storedToken = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (storedToken && !storedToken.revoked) {
      await this.prismaService.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });
    }

    return { message: 'Logout realizado com sucesso.' };
  }

  async logoutEverywhere(userId: string) {
    const result = await this.prismaService.refreshToken.updateMany({
      where: {
        userId: userId,
        revoked: false,
      },
      data: { revoked: true },
    });
    return {
      message: 'Todas as sessões foram encerradas.',
      tokensRevoked: result.count,
    };
  }

  private async generateTokenPair(user: User) {
    const basePayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(
      { ...basePayload, type: 'access' },
      { expiresIn: ACCESS_EXPIRATION },
    );
    const refreshToken = await this.jwtService.signAsync(
      { ...basePayload, type: 'refresh' },
      { expiresIn: REFRESH_EXPIRATION },
    );

    const refreshExpiration = this.getExpirationDate(
      process.env.JWT_REFRESH_EXPIRATION || '7d',
    );

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiration,
      },
    });

    return { accessToken, refreshToken };
  }

  private getExpirationDate(duration: string): Date {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Formato de duração inválido: ${duration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}

interface RefreshTokenPayload {
  sub: string;
  email: string;
  name: string;
  type: 'refresh';
  iat: number;
  exp: number;
}
