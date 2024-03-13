import * as SQLite from 'expo-sqlite';
import Product from '../models/Product';
import { Category, NewCategory } from '../models/Category';
import {
  isCategory,
  isCategoryList,
  isProduct,
  isResultSet,
  isResultSetArray,
} from './typeChecker';
import { productMapFromDb } from './productMapFromBarcode';
import { ResultSet } from 'expo-sqlite';
import { log } from 'expo-updates/build-cli/utils/log';

const database = SQLite.openDatabase('places.db');

export const init = () =>
  new Promise((resolve, reject) => {
    database.transaction((tx) => {
      const nop = () => {};
      const onError = (_: any, error: any) => {
        reject(error);
        return false;
      };
      // tx.executeSql('DROP TABLE IF EXISTS categories;', [], nop, onError);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
                         id INTEGER PRIMARY KEY NOT NULL, 
                         name TEXT NOT NULL,
                         trimName TEXT NOT NULL
                         );`,
        [],
        (_) => {
          resolve(true);
        },
        (_, err) => {
          console.log(err);
          reject(err);
          return true;
        }
      );
      // tx.executeSql('DROP TABLE IF EXISTS products;', [], nop, onError);
      tx.executeSql(
        `
                     CREATE TABLE IF NOT EXISTS products (
                         id INTEGER PRIMARY KEY NOT NULL, 
                         name TEXT NOT NULL, 
                         expirationDate TEXT NOT NULL, 
                         price TEXT, 
                         photoUri TEXT, 
                         description TEXT
                         );`,
        [],
        (_) => {
          resolve(true);
        },
        (_, err) => {
          reject(err);
          console.log(err);
          return true;
        }
      );
      // tx.executeSql('DROP TABLE IF EXISTS productCategories;', [], nop, onError);
      tx.executeSql(
        `
                     CREATE TABLE IF NOT EXISTS productCategories (
                       id INTEGER PRIMARY KEY NOT NULL, 
                       productId INTEGER NOT NULL, 
                       categoryId INTEGER NOT NULL,
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
        (_) => {
          resolve(true);
        },
        (_, err) => {
          reject(err);
          console.log(err);
          return true;
        }
      );
    });
  });

export function insertProductDb({
  name,
  expirationDate,
  price,
  photoUri,
  description,
}: Product): Promise<Product> {
  return new Promise((resolve, reject) => {
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: 'INSERT INTO products (name, expirationDate, price, photoUri, description) VALUES (?, ?, ?, ?, ?) RETURNING *',
          args: [
            name,
            expirationDate.toISOString(),
            price || '',
            photoUri || '',
            description || '',
          ],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet) && isProduct(resultSet[0].rows[0])) {
          console.log(resultSet[0].rows[0]);
          resolve(resultSet[0].rows[0]);
        }
      }
    );
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
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: 'UPDATE products SET name = ?, expirationDate = ?, price = ?, photoUri = ?, description = ? WHERE id = ? RETURNING *',
          args: [
            name,
            expirationDate.toISOString(),
            price || '',
            photoUri || '',
            description || '',
            id,
          ],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet)) {
          console.log(resultSet[0].rows[0]);
          resolve(resultSet[0].rows[0]);
        }
      }
    );
  });
}

export function fetchProductsDb(): Promise<Product[]> {
  return new Promise<Product[]>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT
                       p.name,
                       p.expirationDate,
                       p.price,
                       p.photoUri,
                       p.description,
                       p.id,
                    GROUP_CONCAT(pc.categoryId,',') AS categoryIds
                    FROM products p
                    LEFT JOIN productCategories pc ON p.id = pc.productId
                    WHERE p.name IS NOT NULL;
                   `,
        [],
        (_, result) => {
          const products = productMapFromDb(result.rows._array);
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
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: 'DELETE FROM products WHERE id = ? RETURNING *',
          args: [id],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet)) {
          console.log('delete product', resultSet[0].rows[0]);
          resolve(resultSet[0].rows[0]);
        }
      }
    );
  });
}

export function insertCategoryDb({ name, trimName }: NewCategory): Promise<Category> {
  return new Promise((resolve, reject) => {
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: 'INSERT INTO categories (name, trimName) VALUES (?, ?) RETURNING *',
          args: [name, trimName],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet) && isCategoryList(resultSet[0].rows)) {
          console.log('Insert catepgiry', resultSet[0].rows[0]);
          resolve(resultSet[0].rows[0]);
        }
      }
    );
  });
}

export function insertProductCategories(
  productId: string,
  categories: Category[]
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: `INSERT INTO productCategories (productId, categoryId) VALUES ${categories.map(
            ({ id }) => `(${productId}, ${id})`
          )} RETURNING *;`,
          args: [],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet)) {
          resolve(resultSet[0].rows[0]);
        }
      }
    );
  });
}

export function insertCategoriesDb(newCategory: NewCategory[]): Promise<Category[]> {
  return new Promise((resolve, reject) => {
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: `INSERT INTO categories (name, trimName) VALUES ${newCategory.map(
            ({ name, trimName }) => `("${name}", "${trimName}")`
          )} RETURNING *;`,
          args: [],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet) && isCategoryList(resultSet[0].rows)) {
          console.log('Inserted Categories', resultSet[0].rows);
          resolve(resultSet[0].rows);
        }
      }
    );
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
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: 'DELETE FROM categories WHERE id = ? RETURNING *',
          args: [id],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet) && isCategory(resultSet[0].rows[0])) {
          console.log('Deleted category', resultSet[0].rows[0]);
          resolve(resultSet[0].rows[0]);
        }
      }
    );
  });
}

export function updateCategoryDb({ id, name, trimName }: Category) {
  return new Promise((resolve, reject) => {
    database.execRawQuery(
      [
        {
          // Unsupprted on Android using the `exec` function
          sql: 'UPDATE categories SET name = ?, trimName = ? WHERE id = ? RETURNING *',
          args: [name, trimName, id],
        },
      ],
      false,
      (error, resultSet) => {
        if (error) {
          reject(error);
          return true;
        } else if (isResultSetArray(resultSet) && isCategory(resultSet[0].rows[0])) {
          console.log('Updated Category', resultSet[0].rows[0]);
          resolve(resultSet[0].rows[0]);
        }
      }
    );
  });
}

export function fetchProductsByCategories(categories: Category[]): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM products p
                       INNER JOIN productCategories pc ON p.id = pc.productId
                          WHERE pc.categoryId IN (${categories.map((c) => c.id).join(',')});`,
        [],
        (_, result) => {
          const products = productMapFromDb(result.rows._array);
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
