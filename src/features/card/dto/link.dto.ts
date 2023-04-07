import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Link } from '../schema/link/link.schema';

export type LinkType = CommunicationLink | SocialLink;

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
export const allowedCardLinks = [...socialLinks, ...communicationLinks];

export class LinkDTO implements Link {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  subtitle: string;
  @IsIn(allowedCardLinks)
  @IsNotEmpty()
  type: LinkType;
}
