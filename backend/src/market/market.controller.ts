import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MarketService } from './market.service';
import { User } from '../users/entities/user.entity';

@ApiTags('market')
@ApiBearerAuth()
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('states/:product')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'All state market data for a product' })
  @ApiParam({
    name: 'product',
    enum: ['Rice', 'Cement', 'Sugar', 'Flour', 'Cooking Oil'],
    example: 'Rice',
  })
  @ApiResponse({
    status: 200,
    description: 'Market data for all states.',
    schema: {
      type: 'array',
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          stateName: 'Lagos',
          demandScore: 82,
          supplyScore: 45,
          trend: 'rising',
          shortageRisk: 'high',
          opportunity: true,
          product: 'Rice',
          pricePerUnit: 85000,
          priceTrend: 'up',
          nearbySuppliers: 23,
          trend7days: [82000, 83000, 84000, 85000, 85000, 85500, 86000],
          priceHistory: [82000, 83000, 84500, 85000, 85200, 85800, 86000],
          updatedAt: '2026-06-12T14:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getStates(
    @Param('product') product: string,
  ): Promise<any[]> {
    return this.marketService.findStates(product);
  }

  @Get('state/:state/:product')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Seven-day market detail for one state and product',
  })
  @ApiParam({ name: 'state', example: 'Lagos' })
  @ApiParam({
    name: 'product',
    enum: ['Rice', 'Cement', 'Sugar', 'Flour', 'Cooking Oil'],
    example: 'Rice',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed 7-day market data for a state.',
    schema: {
      type: 'object',
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        stateName: 'Lagos',
        product: 'Rice',
        demandScore: 82,
        supplyScore: 45,
        trend: 'rising',
        shortageRisk: 'high',
        opportunity: true,
        pricePerUnit: 85000,
        priceTrend: 'up',
        nearbySuppliers: 23,
        trend7days: [82000, 83000, 84000, 85000, 85000, 85500, 86000],
        priceHistory: [82000, 83000, 84500, 85000, 85200, 85800, 86000],
        updatedAt: '2026-06-12T14:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'State market data not found.' })
  async getStateDetail(
    @Param('state') state: string,
    @Param('product') product: string,
  ): Promise<any> {
    return this.marketService.findStateDetail(state, product);
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Supported commodity products' })
  @ApiResponse({
    status: 200,
    description: 'List of supported products.',
    schema: {
      type: 'array',
      example: ['Rice', 'Cement', 'Sugar', 'Flour', 'Cooking Oil'],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProducts(): Promise<string[]> {
    return this.marketService.supportedProducts();
  }

  @Get('alerts/personalised')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Opportunity alerts for the current user product interests',
  })
  @ApiResponse({
    status: 200,
    description: 'Personalised opportunity alerts.',
    schema: {
      type: 'array',
      example: [
        {
          alertId: 'a1b2c3d4',
          product: 'Rice',
          fromState: 'Kano',
          toState: 'Lagos',
          supplyScore: 72,
          demandScore: 88,
          estimatedMargin: '₦192,000/bag',
          urgency: 'high',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPersonalisedAlerts(
    @CurrentUser() user: User,
  ): Promise<any[]> {
    return this.marketService.findPersonalisedAlerts(user);
  }

  @Get('alerts/:product')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Top opportunity alerts for a product' })
  @ApiParam({
    name: 'product',
    enum: ['Rice', 'Cement', 'Sugar', 'Flour', 'Cooking Oil'],
    example: 'Rice',
  })
  @ApiResponse({
    status: 200,
    description: 'Top opportunity alerts for a product.',
    schema: {
      type: 'array',
      example: [
        {
          alertId: 'a1b2c3d4',
          product: 'Rice',
          fromState: 'Kano',
          toState: 'Lagos',
          supplyScore: 72,
          demandScore: 88,
          estimatedMargin: '₦192,000/bag',
          urgency: 'high',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAlerts(
    @Param('product') product: string,
  ): Promise<any[]> {
    return this.marketService.findAlerts(product);
  }

  @Get('price-intelligence/:product')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Price per unit across all states sorted cheapest first',
  })
  @ApiParam({
    name: 'product',
    enum: ['Rice', 'Cement', 'Sugar', 'Flour', 'Cooking Oil'],
    example: 'Rice',
  })
  @ApiResponse({
    status: 200,
    description: 'Price intelligence sorted by pricePerUnit ascending.',
    schema: {
      type: 'array',
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          stateName: 'Kano',
          demandScore: 60,
          supplyScore: 75,
          trend: 'stable',
          shortageRisk: 'low',
          opportunity: false,
          product: 'Rice',
          pricePerUnit: 71000,
          priceTrend: 'stable',
          nearbySuppliers: 30,
          trend7days: [70000, 70500, 71000, 71000, 71500, 71000, 71000],
          priceHistory: [70000, 70500, 71000, 71000, 71500, 71000, 71000],
          updatedAt: '2026-06-12T14:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPriceIntelligence(
    @Param('product') product: string,
  ): Promise<any[]> {
    return this.marketService.findPriceIntelligence(product);
  }
}
