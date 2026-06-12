import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateMarketData } from './entities/state-market-data.entity';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  imports: [TypeOrmModule.forFeature([StateMarketData])],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
