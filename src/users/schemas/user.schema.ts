import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  emailRules,
  passwordConfirmRules,
  passwordRules,
  refreshTokenRules,
} from '../user.validations';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends mongoose.Document {
  @Prop(emailRules)
  email: string;
  @Prop(passwordRules)
  password: string;
  @Prop(passwordConfirmRules)
  passwordConfirm: string;
  @Prop(refreshTokenRules)
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
