import Joi from 'joi';
import { ENV_FILES } from 'src/config/env_files';
import mainConfig from 'src/config/main.config';

export default {
  isGlobal: true, // Allow config module everywhere
  envFilePath: ENV_FILES[process.env.NODE_ENV] || '.env',
  load: [mainConfig],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'debug', 'production')
      .default('development'),
    PORT: Joi.number().required(),
    DATABASE_URL: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    TOKEN_PRIVATE_KEY: Joi.string().required(),
    SESSION_LIFETIME: Joi.number().required(),
    REFRESH_TOKEN_LIFETIME: Joi.number().required(),
  }),
};
