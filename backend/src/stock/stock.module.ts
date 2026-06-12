import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockPost } from './entities/stock-post.entity';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockPost])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
