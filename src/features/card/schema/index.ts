import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as cardSchemaRules from './rules';

export type CardDocument = Card & Document;

@Schema({ timestamps: true })
export class Card extends mongoose.Document {
  @Prop(cardSchemaRules.nameRules)
  name: string;
  @Prop(cardSchemaRules.firstNameRules)
  firstName: string;
  @Prop(cardSchemaRules.lastNameRules)
  lastName: string;
  @Prop(cardSchemaRules.jobTitleRules)
  jobTitle: string;
  @Prop(cardSchemaRules.companyRules)
  company: string;
  @Prop(cardSchemaRules.userRules)
  user: mongoose.Schema.Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
