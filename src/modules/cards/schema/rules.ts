import { SchemaRule } from 'src/common/types';

export const nameRules: SchemaRule = {
  type: String,
  required: [true, "'name' is missing."],
  maxlength: 20,
};
