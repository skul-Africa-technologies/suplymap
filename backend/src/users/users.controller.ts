import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user profile.',
    schema: {
      type: 'object',
      example: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        fullName: 'Ade Bakare',
        email: 'ade@example.com',
        phone: '08012345678',
        role: 'wholesaler',
        products: ['Rice', 'Sugar'],
        state: 'Lagos',
        lga: 'Ikeja',
        rating: 4.5,
        totalRatings: 12,
        verified: true,
        createdAt: '2026-06-12T14:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(@CurrentUser() user: User): Promise<UserResponseDto> {
    return this.usersService.toResponse(user);
  }

  @Put('me/products')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user product interests' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Products updated successfully.',
    schema: {
      type: 'object',
      example: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        fullName: 'Ade Bakare',
        email: 'ade@example.com',
        phone: '08012345678',
        role: 'wholesaler',
        products: ['Rice', 'Sugar', 'Flour'],
        state: 'Lagos',
        lga: 'Ikeja',
        rating: 4.5,
        totalRatings: 12,
        verified: true,
        createdAt: '2026-06-12T14:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProducts(
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateProducts(
      user.id,
      dto.products,
    );
    return this.usersService.toResponse(updatedUser);
  }
}
