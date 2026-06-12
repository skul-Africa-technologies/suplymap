import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum StockStatus {
  AVAILABLE = 'available',
  WANTED = 'wanted',
}

@Entity('stock_posts')
export class StockPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  product!: string;

  @Column()
  quantity!: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'price_per_unit',
  })
  pricePerUnit!: number | null;

  @Column({ type: 'enum', enum: StockStatus })
  status!: StockStatus;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column()
  state!: string;

  @Column({ type: 'text', nullable: true })
  lga!: string | null;

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.stockPosts, { eager: false })
  @JoinColumn({ name: 'trader_id' })
  trader!: User;

  @Column({ name: 'trader_id' })
  traderId!: string;
}
