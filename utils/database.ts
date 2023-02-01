import * as SQLite from 'expo-sqlite';
import Product from '../models/Product';

const database = SQLite.openDatabase('places.db');

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
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
}

export function insertProduct({ name, expirationDate, price, photoUri, description }: Product) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO products (name, expirationDate, price, photoUri, description) VALUES (?, ?, ?, ?, ?);`,
        [name, expirationDate, price || '', photoUri || '', description || ''],
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

export function fetchProducts(): Promise<Product[]> {
  const promise = new Promise<Product[]>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM products;`,
        [],
        (_, result) => {
          const products = result.rows._array.map(
            (dp) =>
              new Product(
                dp.id.toString(),
                dp.name,
                dp.expirationDate,
                dp.price,
                dp.photoUri,
                dp.description
              )
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

export function deleteProduct(id: string) {
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
