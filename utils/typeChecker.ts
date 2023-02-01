import { Image } from '../models/Image';
import Product from '../models/Product';

export function isProduct(object: unknown): object is Product {
  if (object !== null && typeof object === 'object') {
    return 'name' in object && 'expirationDate' in object;
  }

  return false;
}

export function isImage(object: unknown): object is Image {
  if (object !== null && typeof object === 'object') {
    return 'uri' in object;
  }

  return false;
}
