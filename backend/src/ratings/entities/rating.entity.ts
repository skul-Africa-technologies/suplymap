import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Unique(['raterId', 'ratedTraderId', 'transactionProduct'])
@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  score!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @Column({ name: 'transaction_product' })
  transactionProduct!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.ratingsGiven)
  @JoinColumn({ name: 'rater_id' })
  rater!: User;

  @Column({ name: 'rater_id' })
  raterId!: string;

  @ManyToOne(() => User, (user) => user.ratingsReceived)
  @JoinColumn({ name: 'rated_trader_id' })
  ratedTrader!: User;

  @Column({ name: 'rated_trader_id' })
  ratedTraderId!: string;
}
