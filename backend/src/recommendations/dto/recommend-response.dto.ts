import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RecommendResponseDto {
  @Expose()
  @ApiProperty()
  recommendation!: string;

  @Expose()
  @ApiProperty()
  confidence!: string;

  @Expose()
  @ApiProperty()
  state!: string;

  @Expose()
  @ApiProperty()
  product!: string;
}
