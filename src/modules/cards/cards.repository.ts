import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(Card.name) private user: Model<CardDocument>) {}

  public async create(): Promise<Card | null> {
    return null;
  }
}
