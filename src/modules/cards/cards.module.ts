import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConstants } from 'src/common/constants';
import { CardsController } from './cards.controller';
import { cardsHooksFactory } from './cards.hooks';
import { CardsService } from './cards.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: databaseConstants.modelNames.card,
        useFactory: cardsHooksFactory,
      },
    ]),
  ],
})
export class CardsModule {}
