import { Controller, Post, Get, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StockService } from './stock.service';
import {
  CreateStockPostDto,
  BrowseStockDto,
} from './dto/create-stock-post.dto';
import { StockPostResponseDto } from './dto/stock-post-response.dto';
import { StockStatus } from './entities/stock-post.entity';
import { TraderRole, User } from '../users/entities/user.entity';

@ApiTags('stock')
@ApiBearerAuth()
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TraderRole.WHOLESALER, TraderRole.DISTRIBUTOR, TraderRole.MANUFACTURER)
  @ApiOperation({ summary: 'Create an available or wanted stock post' })
  @ApiBody({ type: CreateStockPostDto })
  @ApiResponse({
    status: 201,
    description: 'Stock post created successfully.',
    schema: {
      type: 'object',
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        product: 'Rice',
        quantity: '50 bags',
        pricePerUnit: 85000,
        status: 'available',
        description: 'Premium grade rice, well bagged',
        state: 'Lagos',
        lga: 'Ikeja',
        expiresAt: '2026-06-19T10:00:00.000Z',
        createdAt: '2026-06-12T14:00:00.000Z',
        traderId: '660e8400-e29b-41d4-a716-446655440001',
        traderName: 'Ade Wholesale Ltd',
        traderRating: 4.5,
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Only wholesalers, distributors, and manufacturers can create posts.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createPost(
    @Body() dto: CreateStockPostDto,
    @CurrentUser() user: User,
  ): Promise<StockPostResponseDto> {
    return this.stockService.create(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Browse stock posts filtered by product, state, and status',
  })
  @ApiQuery({ name: 'product', required: false, example: 'Rice' })
  @ApiQuery({ name: 'state', required: false, example: 'Lagos' })
  @ApiQuery({ name: 'status', required: false, enum: StockStatus, example: StockStatus.AVAILABLE })
  @ApiResponse({
    status: 200,
    description: 'List of active stock posts.',
    schema: {
      type: 'array',
      example: [
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          product: 'Rice',
          quantity: '50 bags',
          pricePerUnit: 85000,
          status: 'available',
          description: 'Premium grade rice, well bagged',
          state: 'Lagos',
          lga: 'Ikeja',
          expiresAt: '2026-06-19T10:00:00.000Z',
          createdAt: '2026-06-12T14:00:00.000Z',
          traderId: '660e8400-e29b-41d4-a716-446655440001',
          traderName: 'Ade Wholesale Ltd',
          traderRating: 4.5,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async browse(
    @Query() query: BrowseStockDto,
    @CurrentUser() user: User,
  ): Promise<StockPostResponseDto[]> {
    return this.stockService.browse(query, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove an owned stock post' })
  @ApiResponse({
    status: 200,
    description: 'Stock post deleted.',
    schema: {
      type: 'object',
      example: { message: 'Stock post deleted successfully.' },
    },
  })
  @ApiResponse({ status: 403, description: 'You can only delete your own posts.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.stockService.remove(id, user.id);
    return { message: 'Stock post deleted successfully.' };
  }
}
