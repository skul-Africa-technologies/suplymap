import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

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
        firstName: 'Ade',
        lastName: 'Bakare',
        industry: 'Wholesale Rice Trading',
        email: 'ade@example.com',
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
}
