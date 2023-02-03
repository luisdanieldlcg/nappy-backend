import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { minRequiredPasswordLength } from 'src/common/constants';
import { Match } from 'src/common/decorators/match.decorator';

export class SignupDTO {
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'enter a valid email.',
    },
  )
  readonly email: string;
  @IsNotEmpty()
  @MinLength(minRequiredPasswordLength)
  readonly password: string;
  @Match(SignupDTO, (dto) => dto.password, {
    message: 'the passwords entered do not match.',
  })
  readonly passwordConfirm: string;
}