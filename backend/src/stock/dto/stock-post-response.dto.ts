import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StockStatus } from '../entities/stock-post.entity';

export class StockPostResponseDto {
  @Expose()
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Rice' })
  product!: string;

  @Expose()
  @ApiProperty({ example: '50 bags' })
  quantity!: string;

  @Expose()
  @ApiProperty({ example: 85000 })
  pricePerUnit!: number | null;

  @Expose()
  @ApiProperty({ enum: StockStatus, example: StockStatus.AVAILABLE })
  status!: StockStatus;

  @Expose()
  @ApiPropertyOptional({ example: 'Premium grade rice, well bagged' })
  description!: string | null;

  @Expose()
  @ApiProperty({ example: 'Lagos' })
  state!: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Ikeja' })
  lga!: string | null;

  @Expose()
  @ApiProperty({ example: '2026-06-19T10:00:00.000Z' })
  expiresAt!: Date;

  @Expose()
  @ApiProperty({ example: '2026-06-12T10:00:00.000Z' })
  createdAt!: Date;

  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  traderId!: string;

  @Expose()
  @ApiProperty({ example: 'Ade Wholesale Ltd' })
  traderName!: string;

  @Expose()
  @ApiProperty({ example: 4.5 })
  traderRating!: number;
}
