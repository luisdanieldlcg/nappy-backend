import { Controller, Get } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  @Get()
  async getAllCards() {
    const cards = await this.cardsService.getAllCards('123');
    return cards;
  }
}
