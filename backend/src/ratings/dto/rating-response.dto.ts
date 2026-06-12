import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RatingResponseDto {
  @Expose()
  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-fa2345678901' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 5 })
  score!: number;

  @Expose()
  @ApiPropertyOptional({ example: 'Very reliable, delivered on time' })
  comment!: string | null;

  @Expose()
  @ApiProperty({ example: 'Rice' })
  transactionProduct!: string;

  @Expose()
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  raterId!: string;

  @Expose()
  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440002' })
  ratedTraderId!: string;

  @Expose()
  @ApiProperty({ example: '2026-06-12T14:30:00.000Z' })
  createdAt!: Date;
}
