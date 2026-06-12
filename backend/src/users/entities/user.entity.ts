import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StockPost } from '../../stock/entities/stock-post.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column()
  industry!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating!: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings!: number;

  @Column({ default: false })
  verified!: boolean;

  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true })
  refreshTokenHash!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => StockPost, (post) => post.trader, { eager: false })
  stockPosts!: StockPost[];

  @OneToMany(() => Rating, (rating) => rating.rater)
  ratingsGiven!: Rating[];

  @OneToMany(() => Rating, (rating) => rating.ratedTrader)
  ratingsReceived!: Rating[];
}
