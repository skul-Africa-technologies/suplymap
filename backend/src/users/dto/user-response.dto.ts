import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Ade' })
  firstName!: string;

  @Expose()
  @ApiProperty({ example: 'Bakare' })
  lastName!: string;

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
  @ApiProperty({ example: 12 })
  totalRatings!: number;

  @Expose()
  @ApiProperty({ example: true })
  verified!: boolean;

  @Expose()
  @ApiProperty({ example: '2026-06-12T14:00:00.000Z' })
  createdAt!: Date;
}
