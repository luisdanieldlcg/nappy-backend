import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaRules } from '../../../../common/mongo/schema.rules';
import { createSchemaWithMethods } from '../../../../common/mongo/schema.factory';
import { LinkType, allowedCardLinks } from '../../dto/link.dto';

// Card subdocument schema for links.
@Schema()
export class Link {
  @Prop(SchemaRules.stringRequired('title'))
  title: string;
  @Prop(SchemaRules.stringNotRequired)
  subtitle: string;
  @Prop(SchemaRules.mustBelongTo(allowedCardLinks))
  type: LinkType;
}

export const LinkSchema = createSchemaWithMethods(Link);
