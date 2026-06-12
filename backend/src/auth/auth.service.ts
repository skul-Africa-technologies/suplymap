import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

type Expiration = NonNullable<JwtSignOptions['expiresIn']>;

interface Tokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const passwordHash = await hash(dto.password, 12);
    const user = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: dto.role,
      products: dto.products,
       state: dto.state,
      lga: dto.lga ?? null,
    });

    const tokens = await this.issueTokens(user.id);
    await this.usersService.updateRefreshToken(
      user.id,
      tokens.refreshTokenHash,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: await this.toUserResponse(user),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatches = await compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const tokens = await this.issueTokens(user.id);
    await this.usersService.updateRefreshToken(
      user.id,
      tokens.refreshTokenHash,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: await this.toUserResponse(user),
    };
  }

  async refresh(user: User): Promise<AuthResponseDto> {
    const tokens = await this.issueTokens(user.id);
    await this.usersService.updateRefreshToken(
      user.id,
      tokens.refreshTokenHash,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: await this.toUserResponse(user),
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  private async issueTokens(userId: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId }, this.accessSignOptions()),
      this.jwtService.signAsync({ sub: userId }, this.refreshSignOptions()),
    ]);
    const refreshTokenHash = await hash(refreshToken, 12);

    return {
      accessToken,
      refreshToken,
      refreshTokenHash,
    };
  }

  private accessSignOptions(): Pick<JwtSignOptions, 'expiresIn'> {
    return {
      expiresIn: this.expiration('JWT_ACCESS_EXPIRES_IN'),
    };
  }

  private refreshSignOptions(): Pick<JwtSignOptions, 'expiresIn'> {
    return {
      expiresIn: this.expiration('JWT_REFRESH_EXPIRES_IN'),
    };
  }

  private expiration(key: string): Expiration {
    return this.configService.getOrThrow<string>(key) as Expiration;
  }

  private async toUserResponse(user: User): Promise<UserResponseDto> {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
