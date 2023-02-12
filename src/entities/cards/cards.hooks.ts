import { Card, CardSchema } from './schema';

function populateFindQueries(this: Card, next) {
  // this.populate({
  //   path: 'user',
  //   select: 'email',
  // });
  next();
}
export const cardsHooksFactory = () => {
  const schema = CardSchema;
  schema.pre(/^find/, populateFindQueries);
  return schema;
};
