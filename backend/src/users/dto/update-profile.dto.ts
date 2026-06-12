import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ type: [String], example: ['Rice', 'Sugar'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  products!: string[];
}
