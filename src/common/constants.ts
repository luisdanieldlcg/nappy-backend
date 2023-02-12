export const minRequiredPasswordLength = 8;
export const passwordHashRounds = 12;
export const tokenHashRounds = 10;

export const jwtCookieConstants = {
  refreshTokenName: 'jwt-refresh',
  accessTokenName: 'jwt-access',
};

export const databaseConstants = {
  card: {
    name: 'Card',
  },
  user: {
    name: 'User',
    virtualFields: {
      cardsPath: 'cards',
    },
  },
};
