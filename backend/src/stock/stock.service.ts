import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { StockPost } from './entities/stock-post.entity';
import { BrowseStockDto, CreateStockPostDto } from './dto/create-stock-post.dto';
import { StockPostResponseDto } from './dto/stock-post-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockPost)
    private readonly stockRepo: Repository<StockPost>,
  ) {}

  async create(dto: CreateStockPostDto, user: User): Promise<StockPostResponseDto> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const post = this.stockRepo.create({
      product: dto.product,
      quantity: dto.quantity,
      pricePerUnit: dto.pricePerUnit ?? null,
      status: dto.status,
      description: dto.description ?? null,
      state: dto.state,
      lga: dto.lga ?? null,
      expiresAt,
      traderId: user.id,
    });

    const saved = await this.stockRepo.save(post);
    return this.toResponse(saved);
  }

  async browse(
    query: BrowseStockDto,
    user: User,
  ): Promise<StockPostResponseDto[]> {
    const qb = this.stockRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.trader', 'trader')
      .where('post.expires_at > NOW()')
      .andWhere('post.trader_id != :self', { self: user.id });

    if (query.product) {
      qb.andWhere('post.product = :product', { product: query.product });
    }

    if (query.state) {
      qb.andWhere('LOWER(post.state) = LOWER(:state)', { state: query.state });
    }

    if (query.status) {
      qb.andWhere('post.status = :status', { status: query.status });
    }

    qb.orderBy('post.created_at', 'DESC');
    const posts = await qb.getMany();
    return posts.map((post) => this.toResponseDto(post));
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.stockRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (post.traderId !== userId) {
      throw new NotFoundException('Post not found.');
    }

    await this.stockRepo.remove(post);
  }

  private async toResponse(post: StockPost): Promise<StockPostResponseDto> {
    const enriched = await this.stockRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.trader', 'trader')
      .where('post.id = :id', { id: post.id })
      .getOne();

    if (!enriched) {
      throw new NotFoundException('Post not found.');
    }

    return this.toResponseDto(enriched);
  }

  private toResponseDto(post: StockPost): StockPostResponseDto {
    const dto = plainToInstance(StockPostResponseDto, post, {
      excludeExtraneousValues: true,
    });
    return {
      ...dto,
      traderName: post.trader?.fullName ?? '',
      traderRating: post.trader?.rating ?? 0,
    };
  }
}
