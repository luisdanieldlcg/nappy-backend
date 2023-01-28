import { registerAs } from '@nestjs/config';

export default registerAs('main', () => {
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  const DATABASE_URL = process.env.DATABASE_URL.replace(
    '<password>',
    DATABASE_PASSWORD,
  );
  return {
    DATABASE_URL,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    ENVIRONMENT: process.env.NODE_ENV,
  };
});
