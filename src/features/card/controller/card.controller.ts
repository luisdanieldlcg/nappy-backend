import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CardService } from '../service/card.service';
import { CreateCardDTO } from '../dto';
interface GetParam {
  id: string;
}
@Controller()
export class CardController {
  constructor(private readonly cardsService: CardService) {}

  //   @Post()
  //   @HttpCode(HttpStatus.CREATED)
  //   public async create(
  //     @Body() input: CreateCardDTO,
  //     @Param('userId') userId: string,
  //   ) {
  //     if (!input.user) {
  //       input.user = userId;
  //     }
  //     const response = await this.cardsService.create(input);
  //     return response;
  //   }

  //   @Get()
  //   public async findAll() {
  //     const response = await this.cardsService.findAll();
  //     return response;
  //   }
  // }
}
