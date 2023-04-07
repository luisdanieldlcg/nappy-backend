import { plainToClass, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

type SocialLink = 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'facebook';

type CommunicationLink =
  | 'email'
  | 'phone'
  | 'whatsapp'
  | 'discord'
  | 'telegram';

const socialLinks = ['instagram', 'twitter', 'tiktok', 'linkedin', 'facebook'];
const communicationLinks = [
  'email',
  'phone',
  'whatsapp',
  'discord',
  'telegram',
];
const allLinks = [...socialLinks, ...communicationLinks];

export class LinkDefinition {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
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

  @IsOptional()
  @Transform((arg) => {
    return arg.value === 'true';
  })
  useNativeIcons: boolean;
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
