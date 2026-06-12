import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TraderRole } from '../../users/entities/user.entity';

export class FindTradersDto {
  @ApiProperty({ example: 'Rice' })
  @IsString()
  @IsNotEmpty()
  product!: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ enum: TraderRole, example: TraderRole.WHOLESALER })
  @IsEnum(TraderRole)
  @IsOptional()
  role?: TraderRole;
}
