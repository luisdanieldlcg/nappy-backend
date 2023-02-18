import { CardModule } from '../features/card/card.module';
import { UserModule } from '../features/user/user.module';

export default [
  {
    path: '/users',
    module: UserModule,
    children: [
      {
        path: '/:userId/cards',
        module: CardModule,
      },
    ],
  },
];
