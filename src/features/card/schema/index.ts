import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { createSchemaWithMethods } from '../../../common/mongo/schema.factory';
import * as cardSchemaRules from './card.rules';

export type CardDocument = Card & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Card extends mongoose.Document {
  _id: string;
  @Prop(cardSchemaRules.labelRules)
  label: string;
  @Prop(cardSchemaRules.firstNameRules)
  firstName: string;
  @Prop(cardSchemaRules.lastNameRules)
  lastName?: string;
  @Prop(cardSchemaRules.jobTitleRules)
  jobTitle?: string;
  @Prop(cardSchemaRules.companyRules)
  company?: string;
  @Prop(cardSchemaRules.backgroundImageRules)
  coverImage?: string;
  @Prop(cardSchemaRules.avatarImageRules)
  avatarImage?: string;
  // I decided to make parent referencing because the user could potentially have
  // huge array of cards which could reach to the document size limit.
  @Prop(cardSchemaRules.userRules)
  createdBy: mongoose.Schema.Types.ObjectId;
  @Prop(cardSchemaRules.colorRules)
  color: string;
}

export const CardSchema = createSchemaWithMethods(Card);
