import { Image } from '../models/Image';
import Product from '../models/Product';
import { Category } from '../models/Category';
import { SQLResultSet } from 'expo-sqlite';
import { ResultSet } from 'expo-sqlite/src/SQLite.types';

export function isProduct(object: unknown): object is Product {
  if (object !== null && typeof object === 'object') {
    // @ts-ignore
    return 'name' in object && 'expirationDate' in object;
  }

  return false;
}

export function isNewProduct(object: unknown): object is Product {
  if (object !== null && typeof object === 'object') {
    // @ts-ignore
    return 'name' in object;
  }

  return false;
}

export function isString(object: unknown): object is string {
  return object !== null && typeof object === 'string';
}

export function isImage(object: unknown): object is Image {
  if (object !== null && typeof object === 'object') {
    // @ts-ignore
    return 'uri' in object;
  }

  return false;
}

export function isCategoryList(array: Array<unknown>): array is Category[] {
  if (Array.isArray(array) && array.length > 0) {
    // @ts-
    return array.every((object) => 'name' in array);
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

export function isResultSet(object: unknown): object is ResultSet {
  if (object !== null && typeof object === 'object') {
    // @ts-ignore
    return 'id' in object;
  }

  return false;
}

export function isResultSetArray(object: unknown): object is ResultSet[] {
  if (object !== null && Array.isArray(object)) {
    // @ts-ignore
    return 'rows' in object[0];
  }

  return false;
}
