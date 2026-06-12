import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TradersController } from './traders.controller';
import { TradersService } from './traders.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TradersController],
  providers: [TradersService],
})
export class TradersModule {}
