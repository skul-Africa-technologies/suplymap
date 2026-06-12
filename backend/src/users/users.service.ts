import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import type { RegisterDto } from '../auth/dto/register.dto';

type CreateUserInput = Omit<RegisterDto, 'password'> & {
  passwordHash: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(userData: CreateUserInput): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { email: userData.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered.');
    }

    const user = this.usersRepo.create(userData);
    return this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async updateRefreshToken(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.usersRepo.update(userId, { refreshTokenHash });
  }

  async toResponse(user: User): Promise<UserResponseDto> {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
