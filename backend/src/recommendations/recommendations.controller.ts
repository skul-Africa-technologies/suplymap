import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RecommendationsService } from './recommendations.service';
import { RecommendRequestDto } from './dto/recommend-request.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('recommendations')
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post('recommend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a Claude-powered trade recommendation' })
  @ApiBody({ type: RecommendRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Trade recommendation generated.',
    schema: {
      type: 'object',
      example: {
        recommendation: 'Strong demand in Lagos right now. Buy 50 bags of Rice now and hold for 3-5 days — prices are trending up and supply is tight in the local market.',
        confidence: 'high',
        state: 'Lagos',
        product: 'Rice',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'State data not found.' })
  @ApiResponse({ status: 503, description: 'AI service error.' })
  async recommend(
    @Body() dto: RecommendRequestDto,
    @CurrentUser() user: User,
  ): Promise<any> {
    return this.recommendationsService.getRecommendation(dto, user);
  }
}
