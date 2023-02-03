import { SchemaRule } from 'src/common/types';

export const nameRules: SchemaRule = {
  type: String,
  required: [true, "'name' is missing."],
  maxlength: 20,
};

export const firstNameRules: SchemaRule = {
  type: String,
  required: [true, "'firstName' is missing."],
};

export const lastNameRules: SchemaRule = {
  type: String,
  required: false,
};
