import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { minRequiredPasswordLength } from 'src/common/constants';
import { Match } from 'src/common/decorators/validators/match.decorator';

export class LocalSignInDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Enter a valid email.' })
  readonly email: string;
  @IsNotEmpty()
  @MinLength(minRequiredPasswordLength)
  readonly password: string;
}

export class LocalSignupDTO extends LocalSignInDTO {
  @Match(LocalSignInDTO, (dto) => dto.password, {
    message: 'the passwords entered do not match.',
  })
  readonly passwordConfirm: string;
}
