import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDTO } from './dtos';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() input: CreateCardDTO) {
    const response = await this.cardsService.create(input);
    return response;
  }

  @Get()
  public async findAll() {
    const response = await this.cardsService.findAll();
    return response;
  }
}
