import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TraderRole } from '../../users/entities/user.entity';

export class TraderSummaryDto {
  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Ade Wholesale Ltd' })
  fullName!: string;

  @Expose()
  @ApiProperty({ enum: TraderRole, example: TraderRole.WHOLESALER })
  role!: TraderRole;

  @Expose()
  @ApiProperty({ example: 'Lagos' })
  state!: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Ikeja' })
  lga!: string | null;

  @Expose()
  @ApiProperty({ type: [String], example: ['Rice', 'Sugar', 'Flour'] })
  products!: string[];

  @Expose()
  @ApiProperty({ example: 4.5 })
  rating!: number;

  @Expose()
  @ApiProperty({ example: 27 })
  totalRatings!: number;

  @Expose()
  @ApiProperty({ example: true })
  verified!: boolean;

  @Expose({ groups: ['profile'] })
  @ApiPropertyOptional({ example: '08012345678' })
  phone?: string;
}
