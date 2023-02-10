import { minRequiredPasswordLength } from 'src/common/constants';
import { SchemaRule } from 'src/common/types';
import { User } from '.';

export const emailRules: SchemaRule = {
  type: String,
  required: [true, "'email' is missing."],
  unique: true,
  lowercase: true,
};
export const passwordRules: SchemaRule = {
  type: String,
  required: [true, "'password' is missing."],
  minlength: minRequiredPasswordLength,
  // select: false,
};

export const passwordConfirmRules: SchemaRule = {
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

export const refreshTokenRules: SchemaRule = {
  type: String,
  required: false,
  default: undefined,
};
