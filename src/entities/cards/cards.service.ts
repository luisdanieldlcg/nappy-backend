import { Injectable, Logger } from '@nestjs/common';
import { CardRepository } from './cards.repository';
import { CreateCardDTO } from './dtos';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);
  constructor(private readonly cardRepository: CardRepository) {}

  public async create(dto: CreateCardDTO) {
    const result = await this.cardRepository.create(dto);
    const card = result.unwrap();
    return card;
  }

  public async findAll() {
    const cards = await this.cardRepository.findAll();
    return cards.unwrap();
  }
}
