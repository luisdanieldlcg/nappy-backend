import { Injectable } from '@nestjs/common';

@Injectable()
export class CardsService {
  public async getAllCards(id: string) {
    return {
      cards: [],
    };
  }
}
