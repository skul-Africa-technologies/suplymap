import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Rating } from './entities/rating.entity';
import { User } from '../users/entities/user.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { RatingResponseDto } from './dto/rating-response.dto';

interface RatingAggregate {
  avg: string | null;
  count: string;
}

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepo: Repository<Rating>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async submit(dto: SubmitRatingDto, rater: User): Promise<RatingResponseDto> {
    if (dto.score < 1 || dto.score > 5) {
      throw new BadRequestException('Score must be between 1 and 5.');
    }

    if (dto.ratedTraderId === rater.id) {
      throw new BadRequestException('You cannot rate yourself.');
    }

    const ratedTrader = await this.usersRepo.findOne({
      where: { id: dto.ratedTraderId },
    });
    if (!ratedTrader) {
      throw new NotFoundException('Trader not found.');
    }

    const exists = await this.ratingsRepo.findOne({
      where: {
        raterId: rater.id,
        ratedTraderId: dto.ratedTraderId,
        transactionProduct: dto.transactionProduct,
      },
    });
    if (exists) {
      throw new ConflictException(
        'You have already rated this trader for this product.',
      );
    }

    const rating = this.ratingsRepo.create({
      raterId: rater.id,
      ratedTraderId: dto.ratedTraderId,
      score: dto.score,
      comment: dto.comment ?? null,
      transactionProduct: dto.transactionProduct,
    });
    await this.ratingsRepo.save(rating);

    const aggregate = await this.ratingsRepo
      .createQueryBuilder('r')
      .select('AVG(r.score)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.rated_trader_id = :id', { id: dto.ratedTraderId })
      .getRawOne<RatingAggregate>();

    const avg = aggregate?.avg
      ? parseFloat(parseFloat(aggregate.avg).toFixed(2))
      : 0;
    ratedTrader.rating = avg;
    ratedTrader.totalRatings = parseInt(aggregate?.count ?? '0', 10);
    await this.usersRepo.save(ratedTrader);

    return plainToInstance(RatingResponseDto, rating, {
      excludeExtraneousValues: true,
    });
  }

  async findByTrader(traderId: string): Promise<RatingResponseDto[]> {
    const ratings = await this.ratingsRepo.find({
      where: { ratedTraderId: traderId },
      order: { createdAt: 'DESC' },
    });

    return ratings.map((rating) =>
      plainToInstance(RatingResponseDto, rating, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
