import { plainToClass, Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

type SocialLink =
  | 'instagram'
  | 'twitter'
  | 'snapchat'
  | 'linkedin'
  | 'facebook';

type CommunicationLink = 'email' | 'phone' | 'whatsapp' | 'skype' | 'discord';

const socialLinks = [
  'instagram',
  'twitter',
  'snapchat',
  'linkedin',
  'facebook',
];
const communicationLinks = ['email', 'phone', 'whatsapp', 'skype', 'discord'];
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
