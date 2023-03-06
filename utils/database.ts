import * as SQLite from 'expo-sqlite';
import Product from '../models/Product';

const database = SQLite.openDatabase('places.db');

export const init = async () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction(async (tx) => {
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
                         id INTEGER PRIMARY KEY NOT NULL, 
                         name TEXT NOT NULL,
                         );`,
        [],
        () => resolve(true),
        (_, err) => {
          reject(err);
          return true;
        }
      );
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
                         id INTEGER PRIMARY KEY NOT NULL, 
                         name TEXT NOT NULL, 
                         expirationDate TEXT NOT NULL, 
                         price TEXT, 
                         photoUri TEXT, 
                         description TEXT
                         );`,
        [],
        () => resolve(true),
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });

  return promise;
};

export function insertProductDb({ name, expirationDate, price, photoUri, description }: Product) {
  const promise = new Promise((resolve, reject) => {
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

  return promise;
}

export function updateProductDb({
  id,
  name,
  expirationDate,
  price,
  photoUri,
  description,
}: Product) {
  const promise = new Promise((resolve, reject) => {
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

  return promise;
}

export function fetchProductsDb(): Promise<Product[]> {
  const promise = new Promise<Product[]>((resolve, reject) => {
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

  return promise;
}

export function deleteProductDb(id: string) {
  const promise = new Promise((resolve, reject) => {
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

  return promise;
}
