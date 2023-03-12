import * as SQLite from 'expo-sqlite';
import Product from '../models/Product';
import { Category, NewCategory } from '../models/Category';
import { isCategoryList } from './typeChecker';

const database = SQLite.openDatabase('places.db');

export const init = () =>
  new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
                         id INTEGER PRIMARY KEY NOT NULL, 
                         name TEXT NOT NULL
                         );                      
                     CREATE TABLE IF NOT EXISTS products (
                         id INTEGER PRIMARY KEY NOT NULL, 
                         name TEXT NOT NULL, 
                         expirationDate TEXT NOT NULL, 
                         price TEXT, 
                         photoUri TEXT, 
                         description TEXT
                         );   
                     CREATE TABLE IF NOT EXISTS productCategories (
                          CONSTRAINT fk_product
                               FOREIGN KEY (productId)
                               REFERENCES products(id)
                               ON DELETE CASCADE,
                           CONSTRAINT fk_category
                               FOREIGN KEY (categoryId)
                               REFERENCES category(id)
                               ON DELETE CASCADE
                               );                                 
                         `,
        [],
        () => resolve(true),
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });

export function insertProductDb({ name, expirationDate, price, photoUri, description }: Product) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO products (name, expirationDate, price, photoUri, description) VALUES (?, ?, ?, ?, ?);`,
        [name, expirationDate.toISOString(), price || '', photoUri || '', description || ''],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function updateProductDb({
  id,
  name,
  expirationDate,
  price,
  photoUri,
  description,
}: Product) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE products SET name = ?, expirationDate = ?, price = ?, photoUri = ?, description = ? WHERE id = ?;`,
        [name, expirationDate.toISOString(), price || '', photoUri || '', description || '', id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function fetchProductsDb(): Promise<Product[]> {
  return new Promise<Product[]>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM products;`,
        [],
        (_, result) => {
          const products = result.rows._array.map(
            (dp) =>
              new Product({
                id: dp.id.toString(),
                name: dp.name,
                expirationDate: new Date(dp.expirationDate),
                price: dp.price,
                photoUri: dp.photoUri,
                description: dp.description,
              })
          );
          resolve(products);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function deleteProductDb(id: string) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM products WHERE id = ?;`,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function insertCategoryDb({ name }: NewCategory) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO categories (name) VALUES (?);`,
        [name],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function fetchCategoriesDb(): Promise<Category[]> {
  return new Promise<Category[]>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM categories;`,
        [],
        (_, result) => {
          if (isCategoryList(result.rows._array)) {
            resolve(result.rows._array);
          }
          resolve([]);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function deleteCategoryDb(id: string) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM categories WHERE id = ?;`,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}
