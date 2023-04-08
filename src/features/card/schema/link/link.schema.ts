import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaRules } from '../../../../common/mongo/schema.rules';
import { createSchemaWithMethods } from '../../../../common/mongo/schema.factory';
import { LinkType, allowedCardLinks } from '../../dto/link.dto';
import { SchemaRule } from '../../../../common/types';
import { ValidatorProps } from 'mongoose';
import { Card } from '../card.schema';
import { isNumber } from 'class-validator';

const isValidLinkType: SchemaRule = {
  type: String,
  enum: allowedCardLinks,
  required: true,
  validate: {
    message: (props: ValidatorProps) => {
      //
      if (props.value === 'phone') {
        return 'The phone field must match the following format: "ext:phone"';
      }
      return `The Link type must be one of the following: ${allowedCardLinks.join()}`;
    },
    validator(val: LinkType) {
      if (val === 'phone') {
        // validate it matches the following format:
        // +ext:phone
        if (/^\+\d+:\d{8}$/.test(val)) {
          return false;
        }
      }
      return allowedCardLinks.includes(val);
    },
  },
};

// Card subdocument schema for links.
@Schema()
export class Link {
  @Prop(SchemaRules.stringRequired('title'))
  title: string;
  @Prop(SchemaRules.stringNotRequired)
  subtitle: string;
  @Prop(isValidLinkType)
  type: LinkType;
}

export const LinkSchema = createSchemaWithMethods(Link);
