import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as userSchemaRules from './rules';

export type UserDocument = User & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  timestamps: true,
})
export class User extends mongoose.Document {
  @Prop(userSchemaRules.emailRules)
  email: string;
  @Prop(userSchemaRules.passwordRules)
  password: string;
  @Prop(userSchemaRules.passwordConfirmRules)
  passwordConfirm: string;
  @Prop(userSchemaRules.refreshTokenRules)
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
