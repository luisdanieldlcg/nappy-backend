import { PropOptions } from '@nestjs/mongoose';
import { minRequiredPasswordLength } from 'src/constants';
import { User } from './schemas/user.schema';

type Validation = PropOptions<any>;

export const emailRules: Validation = {
  type: String,
  required: [true, "'email' is missing."],
  unique: true,
  lowercase: true,
};
export const passwordRules: Validation = {
  type: String,
  required: [true, "'password' is missing."],
  minlength: minRequiredPasswordLength,
};

export const passwordConfirmRules: Validation = {
  type: String,
  required: [true, "'passwordConfirm' is missing."],
  minlength: minRequiredPasswordLength,
  validate: {
    message: 'The passwords entered do not match',
    validator: function (this: User, val: string) {
      return val === this.password;
    },
  },
};
