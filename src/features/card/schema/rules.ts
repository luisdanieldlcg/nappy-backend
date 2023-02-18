import mongoose from 'mongoose';
import { databaseConstants } from 'src/common/constants';
import { SchemaRule } from 'src/common/types';
const textNotRequired: SchemaRule = {
  type: String,
  required: false,
};

export const nameRules: SchemaRule = {
  type: String,
  required: [true, "'name' is missing."],
  maxlength: 20,
};

export const firstNameRules: SchemaRule = {
  type: String,
  required: [true, "'firstName' is missing."],
};

export const lastNameRules = textNotRequired;
export const jobTitleRules = textNotRequired;
export const companyRules = textNotRequired;

export const userRules = {
  type: mongoose.Schema.Types.ObjectId,
  ref: databaseConstants.user.name,
  required: [true, 'Card must belong to an user.'],
};
