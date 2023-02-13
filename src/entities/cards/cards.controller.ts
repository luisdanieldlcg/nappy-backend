import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDTO } from './dtos';
interface GetParam {
  id: string;
}
@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() input: CreateCardDTO,
    @Param('userId') userId: string,
  ) {
    if (!input.user) {
      input.user = userId;
    }
    const response = await this.cardsService.create(input);
    return response;
  }

  @Get()
  public async findAll() {
    const response = await this.cardsService.findAll();
    return response;
  }
}
