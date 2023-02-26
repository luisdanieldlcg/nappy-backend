import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { from, Observable } from 'rxjs';
import { createSchemaWithMethods } from '../../../common/mongo/schema.factory';
import { checkHash } from '../../../common/helpers/bcrypt';
import * as userSchemaRules from './rules';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop(userSchemaRules.emailRules)
  email: string;
  @Prop(userSchemaRules.passwordRules)
  password: string;
  @Prop(userSchemaRules.passwordConfirmRules)
  passwordConfirm: string;
  @Prop(userSchemaRules.refreshTokenRules)
  refreshToken: string;
  comparePassword(password: string): Observable<boolean> {
    return from(
      checkHash({
        raw: password,
        hash: this.password,
      }),
    );
  }
}

export const UserSchema = createSchemaWithMethods(User);
