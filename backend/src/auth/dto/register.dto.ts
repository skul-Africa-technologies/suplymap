import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { TraderRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Ade Bakare' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'ade@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '08012345678' })
  @IsPhoneNumber('NG')
  phone!: string;

  @ApiProperty({ example: 'SecurePass123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: TraderRole, example: TraderRole.WHOLESALER })
  @IsEnum(TraderRole)
  role!: TraderRole;

  @ApiProperty({ type: [String], example: ['Rice', 'Sugar'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  products!: string[];

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiPropertyOptional({ example: 'Ikeja' })
  @IsString()
  @IsOptional()
  lga?: string;
}
