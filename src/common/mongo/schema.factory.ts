import { SchemaFactory } from '@nestjs/mongoose';

/**
 * Allow the schema to contain defined methods.
 * @param target
 * @returns
 */
export function createSchemaWithMethods<T>(target: new () => T) {
  const schema = SchemaFactory.createForClass<T>(target);

  const proto = target.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(proto);
  for (const name in descriptors) {
    if (name != 'constructor' && typeof proto[name] === 'function') {
      schema.methods[name] = proto[name];
    }
    if (descriptors[name].get || descriptors[name].set) {
      schema
        .virtual(name, {
          toObject: { virtuals: true },
          toJSON: { virtuals: true },
        })
        .get(descriptors[name].get)
        .set(descriptors[name].set);
    }
  }

  schema.set('timestamps', true);
  schema.set('toObject', {
    virtuals: true,
    transform(doc, ret, _) {
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  });
  schema.set('toJSON', {
    virtuals: true,
    transform(doc, ret, _) {
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  });

  return schema;
}
