import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConstants } from 'src/common/constants';
import { CardsController } from './cards.controller';
import { cardsHooksFactory } from './cards.hooks';
import { CardRepository } from './cards.repository';
import { CardsService } from './cards.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, CardRepository],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: databaseConstants.card.name,
        useFactory: cardsHooksFactory,
      },
    ]),
  ],
})
export class CardsModule {}
