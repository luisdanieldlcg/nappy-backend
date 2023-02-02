export const minRequiredPasswordLength = 8;
export const passwordHashRounds = 12;
export const tokenHashRounds = 10;

export const jwtCookieConstants = {
  refreshTokenName: 'jwt-refresh',
  accessTokenName: 'jwt-access',
};

export const databaseConstants = {
  modelNames: {
    user: 'User',
    card: 'Card',
  },
};
