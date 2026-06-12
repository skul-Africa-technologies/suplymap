import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SubmitRatingDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  ratedTraderId!: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @ApiProperty({ example: 'Rice' })
  @IsString()
  @IsNotEmpty()
  transactionProduct!: string;

  @ApiPropertyOptional({ example: 'Very reliable, delivered on time' })
  @IsString()
  @IsOptional()
  comment?: string;
}
