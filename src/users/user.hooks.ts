import { hash } from 'src/utils/bcrypt';
import { UserSchema } from './schemas/user.schema';

async function handlePasswordHash(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await hash(this.password);
    this.passwordConfirm = undefined;
  } catch (error) {
    console.log(error);
  }
  return next();
}

export const injectAllHooks = () => {
  const schema = UserSchema;
  schema.pre('save', handlePasswordHash);
  return schema;
};
