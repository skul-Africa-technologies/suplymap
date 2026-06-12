import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TraderRole } from '../entities/user.entity';

export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Ade Bakare' })
  fullName!: string;

  @Expose()
  @ApiProperty({ example: 'ade@example.com' })
  email!: string;

  @Expose()
  @ApiProperty({ example: '08012345678' })
  phone!: string;

  @Expose()
  @ApiProperty({ enum: TraderRole, example: TraderRole.WHOLESALER })
  role!: TraderRole;

  @Expose()
  @ApiProperty({ type: [String], example: ['Rice', 'Sugar'] })
  products!: string[];

  @Expose()
  @ApiProperty({ example: 'Lagos' })
  state!: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Ikeja' })
  lga!: string | null;

  @Expose()
  @ApiProperty({ example: 4.5 })
  rating!: number;

  @Expose()
  @ApiProperty({ example: 12 })
  totalRatings!: number;

  @Expose()
  @ApiProperty({ example: true })
  verified!: boolean;

  @Expose()
  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  createdAt!: Date;
}
