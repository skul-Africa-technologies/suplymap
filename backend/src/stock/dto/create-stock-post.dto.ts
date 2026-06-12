import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { StockStatus } from '../entities/stock-post.entity';

export class CreateStockPostDto {
  @ApiProperty({ example: 'Rice' })
  @IsString()
  @IsNotEmpty()
  product!: string;

  @ApiProperty({ example: '50 bags' })
  @IsString()
  @IsNotEmpty()
  quantity!: string;

  @ApiPropertyOptional({ example: 85000 })
  @IsNumber()
  @IsOptional()
  pricePerUnit?: number;

  @ApiProperty({ enum: StockStatus, example: StockStatus.AVAILABLE })
  @IsEnum(StockStatus)
  status!: StockStatus;

  @ApiPropertyOptional({ example: 'Premium grade rice, well bagged' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiPropertyOptional({ example: 'Ikeja' })
  @IsString()
  @IsOptional()
  lga?: string;
}

export class BrowseStockDto {
  @ApiPropertyOptional({ example: 'Rice' })
  @IsString()
  @IsOptional()
  product?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ enum: StockStatus, example: StockStatus.AVAILABLE })
  @IsEnum(StockStatus)
  @IsOptional()
  status?: StockStatus;
}
