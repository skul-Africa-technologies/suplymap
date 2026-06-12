import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('state_market_data')
export class StateMarketData {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'state_name' })
  stateName!: string;

  @Column({ name: 'demand_score' })
  demandScore!: number;

  @Column({ name: 'supply_score' })
  supplyScore!: number;

  @Column()
  trend!: string;

  @Column({ name: 'shortage_risk' })
  shortageRisk!: string;

  @Column()
  opportunity!: boolean;

  @Column()
  product!: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'price_per_unit',
  })
  pricePerUnit!: number | null;

@Column({ name: 'price_trend', type: 'jsonb', nullable: true })
priceTrend?: string | null;

  @Column({ name: 'nearby_suppliers', default: 0 })
  nearbySuppliers!: number;

  @Column({ type: 'simple-array', name: 'trend_7days', nullable: true })
  trend7days!: number[] | null;

  @Column({ type: 'simple-array', name: 'price_history', nullable: true })
  priceHistory!: number[] | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
