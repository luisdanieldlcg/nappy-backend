import mongoose from 'mongoose';
import { databaseConstants } from '../../../common/constants';
import { SchemaRule } from '../../../common/types';
import { LinkDefinition } from '../dto/card.dto';

// set undefined value if empty
const undefinedIfEmpty = (val?: string) => {
  if (!val) return undefined;
  return val;
};

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

export const backgroundImageRules: SchemaRule = {
  type: String,
  required: false,
  default: undefined,
  set: undefinedIfEmpty,
};

export const avatarImageRules: SchemaRule = {
  type: String,
  required: false,
  default: undefined,
  set: undefinedIfEmpty,
};

export const colorRules: SchemaRule = {
  type: String,
  required: false,
  default: '#B0BEC5',
  // Adds # sign to the color if it's missing
  validate: {
    message: 'Invalid hex color code.',
    // This regular expression defines a pattern for matching a hex color code
    // in the format of #RRGGBB or #RGB, where R, G, and B represent red, green, and blue color components respectively.
    validator: (val: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val),
  },
};

export const linkRules: SchemaRule = {
  type: LinkDefinition,
  required: false,
  default: [],
};
