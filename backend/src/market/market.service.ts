import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import type { RawMarketRow } from './types';
import { StateMarketData } from './entities/state-market-data.entity';
import { OpportunityAlertDto } from './dto/opportunity-alert.dto';
import { StateMarketResponseDto } from './dto/state-market-response.dto';
import { StateDetailResponseDto } from './dto/state-detail-response.dto';
import { User } from '../users/entities/user.entity';
import { riceData as RiceData } from './data/rice-data';
import { CementData } from './data/cement-data';
import { SugarData } from './data/sugar-data';
import { FlourData } from './data/flour-data';
import { CookingOilData } from './data/cooking_oil-data';

export const SUPPORTED_PRODUCTS = [
  'Rice',
  'Cement',
  'Sugar',
  'Flour',
  'Cooking Oil',
] as const;

const PRODUCT_DATA: Record<string, readonly RawMarketRow[]> = {
  Rice: RiceData,
  Cement: CementData,
  Sugar: SugarData,
  Flour: FlourData,
  'Cooking Oil': CookingOilData,
};

@Injectable()
export class MarketService implements OnModuleInit {
  constructor(
    @InjectRepository(StateMarketData)
    private readonly stateMarketRepo: Repository<StateMarketData>,
  ) {}

  async onModuleInit(): Promise<void> {
    for (const product of SUPPORTED_PRODUCTS) {
      const raw = PRODUCT_DATA[product] ?? [];

      for (const row of raw) {
        const existing = await this.stateMarketRepo.findOne({
          where: {
            stateName: row.state_name,
            product: this.normalizeProduct(row.product),
          },
        });

        if (!existing) {
          await this.stateMarketRepo.save(this.toEntity(row));
        }
      }
    }
  }

  async findStates(product: string): Promise<StateMarketResponseDto[]> {
    const data = await this.stateMarketRepo.find({
      where: { product },
      order: { stateName: 'ASC' },
    });
    return data.map((item) =>
      plainToInstance(StateMarketResponseDto, item, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findStateDetail(
    state: string,
    product: string,
  ): Promise<StateDetailResponseDto> {
    const data = await this.stateMarketRepo.findOne({
      where: { stateName: state, product },
    });

    if (!data) {
      throw new NotFoundException('State market data not found.');
    }

    return plainToInstance(StateDetailResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  supportedProducts(): string[] {
    return [...SUPPORTED_PRODUCTS];
  }

  async findAlerts(product: string): Promise<OpportunityAlertDto[]> {
    const data = await this.stateMarketRepo.find({ where: { product } });
    return this.computeAlerts(product, data);
  }

  async findPersonalisedAlerts(user: User): Promise<OpportunityAlertDto[]> {
    const alerts: OpportunityAlertDto[] = [];
    for (const product of user.products) {
      if (
        !SUPPORTED_PRODUCTS.includes(
          product as (typeof SUPPORTED_PRODUCTS)[number],
        )
      ) {
        continue;
      }

      const data = await this.stateMarketRepo.find({ where: { product } });
      alerts.push(...this.computeAlerts(product, data));
    }

    return alerts.sort((a, b) => b.demandScore - a.demandScore).slice(0, 15);
  }

  async findPriceIntelligence(
    product: string,
  ): Promise<StateMarketResponseDto[]> {
    const data = await this.stateMarketRepo.find({
      where: { product },
      order: { pricePerUnit: 'ASC', stateName: 'ASC' },
    });

    return data
      .sort(
        (a, b) =>
          this.priceSortValue(a.pricePerUnit) -
          this.priceSortValue(b.pricePerUnit),
      )
      .map((item) =>
        plainToInstance(StateMarketResponseDto, item, {
          excludeExtraneousValues: true,
        }),
      );
  }

  computeAlerts(
    product: string,
    data: StateMarketData[],
  ): OpportunityAlertDto[] {
    const highDemand = data
      .filter((state) => state.demandScore >= 70)
      .sort((a, b) => b.demandScore - a.demandScore);

    const highSupply = data
      .filter((state) => state.supplyScore >= 65)
      .sort((a, b) => b.supplyScore - a.supplyScore);

    const alerts: OpportunityAlertDto[] = [];
    for (const dest of highDemand.slice(0, 5)) {
      const src = highSupply.find(
        (state) => state.stateName !== dest.stateName,
      );
      if (!src) {
        continue;
      }

      const margin = (dest.demandScore - src.supplyScore) * 120;
      alerts.push({
        alertId: randomUUID().slice(0, 8),
        product,
        fromState: src.stateName,
        toState: dest.stateName,
        supplyScore: src.supplyScore,
        demandScore: dest.demandScore,
        estimatedMargin: `₦${margin.toLocaleString('en-NG')}/bag`,
        urgency: dest.demandScore >= 85 ? 'high' : 'medium',
      });
    }

    return alerts;
  }

  private toEntity(row: RawMarketRow): StateMarketData {
    const shortageRisk = Array.isArray(row.shortage_risk)
      ? (row.shortage_risk[0] ?? 'low')
      : row.shortage_risk;

    return this.stateMarketRepo.create({
      stateName: row.state_name,
      product: this.normalizeProduct(row.product),
      demandScore: row.demand_score,
      supplyScore: row.supply_score,
      trend: row.trend,
      shortageRisk,
      opportunity: row.opportunity,
      pricePerUnit: row.price_per_unit ?? null,
      priceTrend: row.price_trend ?? null,
      nearbySuppliers: row.nearby_suppliers ?? 0,
      trend7days: row.trend_7days ?? null,
      priceHistory: row.price_history ?? null,
    });
  }

  private normalizeProduct(product: string): string {
    return product === 'Suger' ? 'Sugar' : product;
  }

  private priceSortValue(price: number | null): number {
    return price === null ? Number.MAX_SAFE_INTEGER : price;
  }
}
