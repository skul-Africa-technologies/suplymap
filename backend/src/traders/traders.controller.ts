import { Controller, Get, Param, Query, UseGuards, Body, Post, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TradersService } from './traders.service';
import { FindTradersDto } from './dto/find-traders.dto';
import { TraderSummaryDto } from './dto/trader-summary.dto';
import { User, TraderRole } from '../users/entities/user.entity';

@ApiTags('traders')
@ApiBearerAuth()
@Controller('traders')
export class TradersController {
  constructor(private readonly tradersService: TradersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Discover traders by product, state, and role' })
  @ApiQuery({ name: 'product', required: true, example: 'Rice' })
  @ApiQuery({ name: 'state', required: false, example: 'Lagos' })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: TraderRole,
    example: TraderRole.WHOLESALER,
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching traders.',
    schema: {
      type: 'array',
      example: [
        {
          id: '770e8400-e29b-41d4-a716-446655440002',
          fullName: 'Ade Wholesale Ltd',
          role: 'wholesaler',
          state: 'Lagos',
          lga: 'Ikeja',
          products: ['Rice', 'Sugar', 'Flour'],
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
  @ApiOperation({
    summary: 'Single trader profile with phone revealed after connection',
  })
  @ApiResponse({
    status: 200,
    description: 'Trader profile found.',
    schema: {
      type: 'object',
      example: {
        id: '770e8400-e29b-41d4-a716-446655440002',
        fullName: 'Ade Wholesale Ltd',
        role: 'wholesaler',
        state: 'Lagos',
        lga: 'Ikeja',
        products: ['Rice', 'Sugar', 'Flour'],
        rating: 4.5,
        totalRatings: 27,
        verified: true,
        phone: '08012345678',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trader not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<TraderSummaryDto> {
    return this.tradersService.findOne(id);
  }
}
