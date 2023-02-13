import { CardsModule } from 'src/entities/cards/cards.module';
import { UsersModule } from 'src/entities/users/users.module';

export default [
  {
    path: '/users',
    module: UsersModule,
    children: [
      {
        path: '/:userId/cards',
        module: CardsModule,
      },
    ],
  },
];
