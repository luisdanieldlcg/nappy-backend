import { plainToClass, Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { isValidObjectId, ObjectId } from 'mongoose';

type SocialLink = 'instagram' | 'facebook' | 'whatsapp';
type CommunicationLink = 'discord' | 'linkedin' | 'github';

const socialLinks = ['instagram', 'facebook', 'whatsapp'];
const communicationLinks = ['discord', 'linkedin', 'github', 'email'];

const allLinks = [...socialLinks, ...communicationLinks];

export class LinkDefinition {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  subtitle: string;
  @IsIn(allLinks)
  @IsNotEmpty()
  type?: SocialLink | CommunicationLink;
}

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

  @IsOptional()
  @Type(() => LinkDefinition)
  @Transform((arg) => {
    const links = JSON.parse(arg.value);
    const linkObjects = plainToClass(LinkDefinition, links);
    return linkObjects;
  })
  @ValidateNested({ each: true })
  links: LinkDefinition[];
}
export class CreateCardDTO extends CardDTO {}

export class UpdateCardDTO extends CardDTO {
  @IsString()
  @IsNotEmpty()
  createdBy: ObjectId;

  @IsString()
  @IsNotEmpty()
  id: ObjectId;
}
