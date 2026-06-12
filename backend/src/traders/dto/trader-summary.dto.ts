import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TraderSummaryDto {
  @Expose()
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Ade Bakare' })
  fullName!: string;

  @Expose()
  @ApiProperty({ example: 'Wholesale Rice Trading' })
  industry!: string;

  @Expose()
  @ApiProperty({ example: 'ade@example.com' })
  email!: string;

  @Expose()
  @ApiProperty({ example: 4.5 })
  rating!: number;

  @Expose()
  @ApiProperty({ example: 27 })
  totalRatings!: number;

  @Expose()
  @ApiProperty({ example: true })
  verified!: boolean;
}
