import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OpportunityAlertDto {
  @Expose()
  @ApiProperty()
  alertId!: string;

  @Expose()
  @ApiProperty()
  product!: string;

  @Expose()
  @ApiProperty()
  fromState!: string;

  @Expose()
  @ApiProperty()
  toState!: string;

  @Expose()
  @ApiProperty()
  supplyScore!: number;

  @Expose()
  @ApiProperty()
  demandScore!: number;

  @Expose()
  @ApiProperty()
  estimatedMargin!: string;

  @Expose()
  @ApiProperty()
  urgency!: string;
}
