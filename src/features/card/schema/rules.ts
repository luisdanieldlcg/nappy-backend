import mongoose from 'mongoose';
import { databaseConstants } from '../../../common/constants';
import { SchemaRule } from '../../../common/types';

const textNotRequired: SchemaRule = {
  type: String,
  required: false,
};

export const labelRules: SchemaRule = {
  type: String,
  required: false,
  default: 'Work',
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

export const backgroundPathRules: SchemaRule = {
  type: String,
  required: false,
  default: undefined,
};
