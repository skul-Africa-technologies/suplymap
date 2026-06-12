import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class FindTradersDto {
  @ApiPropertyOptional({ example: 'Rice' })
  @IsString()
  @IsOptional()
  product?: string;
}
