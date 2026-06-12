import { Controller, Get, Param, Body, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { RatingResponseDto } from './dto/rating-response.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('ratings')
@ApiBearerAuth()
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit a trader rating' })
  @ApiBody({ type: SubmitRatingDto })
  @ApiResponse({
    status: 201,
    description: 'Rating submitted successfully.',
    schema: {
      type: 'object',
      example: {
        id: 'b2c3d4e5-f6a7-8901-bcde-fa2345678901',
        score: 5,
        comment: 'Very reliable, delivered on time',
        transactionProduct: 'Rice',
        raterId: '660e8400-e29b-41d4-a716-446655440001',
        ratedTraderId: '770e8400-e29b-41d4-a716-446655440002',
        createdAt: '2026-06-12T14:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid score or self-rating.' })
  @ApiResponse({ status: 403, description: 'You can only rate traders you traded with.' })
  @ApiResponse({ status: 404, description: 'Trader not found.' })
  @ApiResponse({ status: 409, description: 'You have already rated this trader for this product.' })
  async submit(
    @Body() dto: SubmitRatingDto,
    @CurrentUser() user: User,
  ): Promise<RatingResponseDto> {
    return this.ratingsService.submit(dto, user);
  }

  @Get(':traderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all ratings for a trader' })
  @ApiResponse({
    status: 200,
    description: 'List of ratings for the trader.',
    schema: {
      type: 'array',
      example: [
        {
          id: 'b2c3d4e5-f6a7-8901-bcde-fa2345678901',
          score: 5,
          comment: 'Very reliable, delivered on time',
          transactionProduct: 'Rice',
          raterId: '660e8400-e29b-41d4-a716-446655440001',
          ratedTraderId: '770e8400-e29b-41d4-a716-446655440002',
          createdAt: '2026-06-12T14:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findByTrader(
    @Param('traderId') traderId: string,
  ): Promise<RatingResponseDto[]> {
    return this.ratingsService.findByTrader(traderId);
  }
}
