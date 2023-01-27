import { IsEmail, MinLength } from 'class-validator';
import { minRequiredPasswordLength } from 'src/constants';

export class LoginDTO {
  @IsEmail(
    {},
    {
      message: 'Enter a valid email.',
    },
  )
  readonly email: string;
  @MinLength(minRequiredPasswordLength)
  readonly password: string;
}
