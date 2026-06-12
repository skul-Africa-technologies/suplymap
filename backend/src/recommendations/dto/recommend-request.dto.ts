import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SUPPORTED_PRODUCTS } from '../../market/market.service';

export class RecommendRequestDto {
  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ enum: [...SUPPORTED_PRODUCTS], example: 'Rice' })
  @IsString()
  @IsIn([...SUPPORTED_PRODUCTS])
  product!: string;
}
