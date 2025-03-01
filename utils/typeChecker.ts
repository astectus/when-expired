import { Image } from '../models/Image';
import Product from '../models/Product';
import { Category } from '../models/Category';

export function isProduct(object: unknown): object is Product {
  if (object !== null && typeof object === 'object') {
    // @ts-ignore
    return 'name' in object && 'expirationDate' in object;
  }

  return false;
}

export function isString(object: unknown): object is string {
  return object !== null && typeof object === 'string';
}

export function isImage(object: unknown): object is Image {
  if (object !== null && typeof object === 'object') {
    // @ts-ignore
    return 'uri' in object.assets[0];
  }

  return false;
}

export function isCategory(object: unknown): object is Category {
  if (object !== null && typeof object === 'object') {
    // @ts-ignore
    return 'name' in object;
  }

  return false;
}
