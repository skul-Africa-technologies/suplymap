import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StateMarketResponseDto {
  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Lagos' })
  stateName!: string;

  @Expose()
  @ApiProperty({ example: 82 })
  demandScore!: number;

  @Expose()
  @ApiProperty({ example: 45 })
  supplyScore!: number;

  @Expose()
  @ApiProperty({ example: 'rising' })
  trend!: string;

  @Expose()
  @ApiProperty({ example: 'high' })
  shortageRisk!: string;

  @Expose()
  @ApiProperty({ example: true })
  opportunity!: boolean;

  @Expose()
  @ApiProperty({ example: 'Rice' })
  product!: string;

  @Expose()
  @ApiProperty({ example: 85000 })
  pricePerUnit!: number | null;

  @Expose()
  @ApiProperty({ example: 'up' })
  priceTrend!: string | null;

  @Expose()
  @ApiProperty({ example: 23 })
  nearbySuppliers!: number;

  @Expose()
  @ApiProperty({ type: [Number], example: [82000, 83000, 84000, 85000, 85000, 85500, 86000] })
  trend7days!: number[] | null;

  @Expose()
  @ApiProperty({ type: [Number], example: [82000, 83000, 84500, 85000, 85200, 85800, 86000] })
  priceHistory!: number[] | null;

  @Expose()
  @ApiProperty({ example: '2026-06-12T14:00:00.000Z' })
  updatedAt!: Date;
}
