import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { FindTradersDto } from './dto/find-traders.dto';
import { TraderSummaryDto } from './dto/trader-summary.dto';

@Injectable()
export class TradersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findTraders(
    query: FindTradersDto,
    requestingUserId: string,
  ): Promise<TraderSummaryDto[]> {
    const qb = this.usersRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.industry',
        'user.email',
        'user.rating',
        'user.totalRatings',
        'user.verified',
      ])
      .where('user.id != :self', { self: requestingUserId })
      .andWhere('LOWER(user.industry) LIKE LOWER(:product)', {
        product: `%${query.product}%`,
      });

    qb.orderBy('user.verified', 'DESC')
      .addOrderBy('user.rating', 'DESC')
      .limit(20);

    const users = await qb.getMany();
    return users.map((user) =>
      plainToInstance(TraderSummaryDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<TraderSummaryDto> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Trader not found.');
    }

    return plainToInstance(TraderSummaryDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
