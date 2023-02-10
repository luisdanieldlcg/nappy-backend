import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoDBRepository } from 'src/database/repository';
import { CardDTO } from './dtos/card_dto';
import { Card, CardDocument } from './schema';

@Injectable()
export class CardRepository extends MongoDBRepository<CardDocument, CardDTO> {
  constructor(@InjectModel(Card.name) readonly cardModel: Model<CardDocument>) {
    super(cardModel);
  }

  toDTO(entity: CardDocument): CardDTO {
    return {
      title: entity.title,
    };
  }
}
