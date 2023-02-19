import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoDBRepository } from 'src/interface/repository/impl/mongo.repository-impl';
import { Stream } from '../../../interface/repository/repository';
import { UserPrincipal } from '../../auth/interface/user-principal.interface';
import { Card, CardDocument } from '../schema';

type T = CardDocument;

@Injectable()
export class CardRepository extends MongoDBRepository<T> {
  constructor(@InjectModel(Card.name) protected readonly cardModel: Model<T>) {
    super(cardModel);
  }
  public findByUser(user: UserPrincipal): Stream<Card[]> {
    return this.find({ createdBy: user.id });
  }
}
