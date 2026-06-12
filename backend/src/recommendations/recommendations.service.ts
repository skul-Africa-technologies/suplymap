import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StateMarketData } from '../market/entities/state-market-data.entity';
import { User } from '../users/entities/user.entity';
import { RecommendRequestDto } from './dto/recommend-request.dto';
import { RecommendResponseDto } from './dto/recommend-response.dto';

interface AnthropicMessageResponse {
  content: Array<{ text: string }>;
}

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(StateMarketData)
    private readonly stateMarketRepo: Repository<StateMarketData>,
  ) {}

  async getRecommendation(
    dto: RecommendRequestDto,
    user: User,
  ): Promise<RecommendResponseDto> {
    const stateData = await this.stateMarketRepo.findOne({
      where: { stateName: dto.state, product: dto.product },
    });

    if (!stateData) {
      throw new NotFoundException('State data not found.');
    }

    const prompt = this.buildPrompt(stateData, user.industry);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.configService.getOrThrow<string>('ANTHROPIC_API_KEY'),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.configService.getOrThrow<string>('ANTHROPIC_MODEL'),
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('AI service error.');
    }

    const data = (await response.json()) as AnthropicMessageResponse;
    const text = data.content[0]?.text.trim();
    if (!text) {
      throw new ServiceUnavailableException(
        'AI service returned an empty response.',
      );
    }

    return {
      recommendation: text,
      confidence: stateData.demandScore >= 80 ? 'high' : 'medium',
      state: dto.state,
      product: dto.product,
    };
  }

  private buildPrompt(state: StateMarketData, role: string): string {
    return `You are a Nigerian commodity trade advisor. Give a short, direct, actionable recommendation.

Trader industry: ${role}
Product: ${state.product}
State: ${state.stateName}
Demand score: ${state.demandScore}/100
Supply score: ${state.supplyScore}/100
7-day trend: ${state.trend}
Shortage risk: ${state.shortageRisk}
Current price: ₦${state.pricePerUnit?.toLocaleString('en-NG') ?? 'unknown'}/bag

Write 2–3 sentences max. Be specific about quantities or timing. Plain English, no bullet points.`;
  }
}
