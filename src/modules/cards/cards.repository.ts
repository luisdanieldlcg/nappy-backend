import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoRepository } from 'src/database/mongo.repository';
import { Card, CardDocument } from './schema';

@Injectable()
export class CardRepository extends MongoRepository<CardDocument> {
  constructor(@InjectModel(Card.name) readonly cardModel: Model<CardDocument>) {
    super(cardModel);
  }
}
