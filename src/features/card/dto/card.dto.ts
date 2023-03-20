import { IsOptional, IsString } from 'class-validator';

export class CardDTO {
  @IsString()
  @IsOptional()
  label: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  jobTitle: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  coverImage: string;

  @IsString()
  @IsOptional()
  avatarImage: string;

  @IsString()
  @IsOptional()
  color: string;
}

export class CreateCardDTO extends CardDTO {}
