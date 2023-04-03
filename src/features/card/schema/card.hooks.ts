import { Card, CardDocument, CardSchema } from '.';

const IMAGE_URL_PREFIX = 'http://localhost:3001/images/';

function populateFindQueries(this: Card, next: () => void) {
  // this.populate({
  //   path: 'user',
  //   select: 'email',
  // });
  next();
}

// This function will add the url prefix to the image field
function addImageUrlPrefixToAll(
  docs: CardDocument | CardDocument[],
  next: () => void,
) {
  if (!docs) return next();
  if (Array.isArray(docs)) {
    // First we need to check if the docs is an array or a single document
    // And then we need to check if the document has an avatarImage or coverImage
    // If it does, we need to add the prefix to the image name
    // If the docs is an array, we need to loop through the array and add the prefix to the image name
    docs.forEach(addImageUrlPrefix);
  } else {
    // If the docs is a single document, we need to add the prefix to the image name
    addImageUrlPrefix(docs);
  }
  return next();
}

function addImageUrlPrefix(doc: CardDocument) {
  if (doc.avatarImage) {
    doc.avatarImage = IMAGE_URL_PREFIX + doc.avatarImage;
  }
  if (doc.coverImage) {
    doc.coverImage = IMAGE_URL_PREFIX + doc.coverImage;
  }
}
export const cardsHooksFactory = () => {
  const schema = CardSchema;
  schema.pre(/^find/, populateFindQueries);
  schema.post(/^find/, addImageUrlPrefixToAll);
  schema.post('save', addImageUrlPrefix);
  return schema;
};
