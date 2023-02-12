import { Body, Controller, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDTO } from './dtos';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() input: CreateCardDTO) {
    await this.cardsService.create(input);
    return {};
  }
}
