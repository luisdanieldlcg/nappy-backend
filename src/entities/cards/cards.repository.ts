import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoDBRepository } from 'src/database/repository/impl/mongo.repository-impl';
import { CardDTO } from './dtos';
import { Card, CardDocument } from './schema';

@Injectable()
export class CardRepository extends MongoDBRepository<CardDocument, CardDTO> {
  constructor(@InjectModel(Card.name) readonly cardModel: Model<CardDocument>) {
    super(cardModel);
  }
}
