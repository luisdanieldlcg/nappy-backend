import { registerAs } from '@nestjs/config';

export default registerAs('main', () => {
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  const DATABASE_URL = process.env.DATABASE_URL.replace(
    '<password>',
    DATABASE_PASSWORD,
  );
  return {
    DATABASE_URL,
    TOKEN_PRIVATE_KEY: process.env.TOKEN_PRIVATE_KEY,
    TOKEN_COOKIE_EXPIRES_IN: parseInt(process.env.TOKEN_COOKIE_EXPIRES_IN),
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    ENVIRONMENT: process.env.NODE_ENV,
  };
});
