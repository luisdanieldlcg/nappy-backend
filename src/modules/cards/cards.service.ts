import { Injectable, Logger } from '@nestjs/common';
import { CardRepository } from './cards.repository';
import { CreateCardDTO } from './dtos/card_dto';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);
  constructor(private readonly cardRepository: CardRepository) {}

  public async create(dto: CreateCardDTO) {
    const card = new this.cardRepository.cardModel(dto);
    await this.cardRepository.create(card);
  }
}
