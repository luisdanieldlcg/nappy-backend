import { Injectable, Logger } from '@nestjs/common';
import { CardRepository } from '../repository/card.repository';
import { CreateCardDTO } from '../dto';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  constructor(private readonly cardRepository: CardRepository) {}

  // public async create(dto: CreateCardDTO) {
  //   const result = await this.cardRepository.create(dto);
  //   const card = result.unwrap();
  //   return card;
  // }

  // public async findAll() {
  //   const cards = await this.cardRepository.findAll();
  //   return cards.unwrap();
  // }
}
