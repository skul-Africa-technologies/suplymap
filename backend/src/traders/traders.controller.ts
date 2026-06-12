import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TradersService } from './traders.service';
import { FindTradersDto } from './dto/find-traders.dto';
import { TraderSummaryDto } from './dto/trader-summary.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('traders')
@ApiBearerAuth()
@Controller('traders')
export class TradersController {
  constructor(private readonly tradersService: TradersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find traders by industry keyword' })
  @ApiQuery({ name: 'product', required: true, example: 'Rice' })
  @ApiResponse({
    status: 200,
    description: 'List of matching traders.',
    schema: {
      type: 'array',
      example: [
        {
          id: '770e8400-e29b-41d4-a716-446655440002',
          fullName: 'Ade Bakare',
          industry: 'Wholesale Rice Trading',
          email: 'ade@example.com',
          rating: 4.5,
          totalRatings: 27,
          verified: true,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findTraders(
    @Query() query: FindTradersDto,
    @CurrentUser() user: User,
  ): Promise<TraderSummaryDto[]> {
    return this.tradersService.findTraders(query, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Single trader profile' })
  @ApiResponse({
    status: 200,
    description: 'Trader profile found.',
    schema: {
      type: 'object',
      example: {
        id: '770e8400-e29b-41d4-a716-446655440002',
        firstName: 'Ade',
        lastName: 'Bakare',
        industry: 'Wholesale Rice Trading',
        email: 'ade@example.com',
        rating: 4.5,
        totalRatings: 27,
        verified: true,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trader not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<TraderSummaryDto> {
    return this.tradersService.findOne(id);
  }
}
