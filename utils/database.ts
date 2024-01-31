import * as SQLite from 'expo-sqlite';
import Product from '../models/Product';
import { Category, NewCategory } from '../models/Category';
import { isCategory, isCategoryList } from './typeChecker';
import { productMapFromDb } from './productMapFromBarcode';

const database = SQLite.openDatabase('places.db');

export const init = () =>
  new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`DROP TABLE IF EXISTS categories;`);
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
      tx.executeSql(`DROP TABLE IF EXISTS products;`);
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
      tx.executeSql(`DROP TABLE IF EXISTS productCategories;`);
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
        `SELECT 
                       products.name,
                       products.expirationDate,
                       products.price,
                       products.photoUri,
                       products.description,
                       products.id,
                    GROUP_CONCAT(productCategories.categoryId,',') AS categoryIds
                    FROM products
                    LEFT JOIN productCategories ON products.id = productCategories.productId;`,
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
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM products WHERE id = ?;`,
        [id],
        (_, result) => {
          j;
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

export function insertCategoryDb({ name, trimName }: NewCategory): Promise<Category> {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO categories (name, trimName) VALUES (?, ?);`,
        [name, trimName],
        (_, result) => {
          console.log(result);
          const dbResult = result.rows._array[0];
          if (isCategory(dbResult)) {
            resolve(dbResult);
          }
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function insertProductCategories(productId: string, categories: Category[]): Promise<void> {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO productCategories (productId, categoryId) VALUES ${categories.map(
          ({ id }) => `(${productId}, ${id})`
        )};`,
        [],
        (_, result) => {
          console.log(result);
          resolve();
        },
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

export function insertCategoriesDb(newCategory: NewCategory[]): Promise<Category[]> {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO categories (name, trimName) VALUES ${newCategory.map(
          ({ name, trimName }) => `(${name}, ${trimName})`
        )};`,
        [],
        (_, result) => {
          console.log(result);
          const dbResult = result.rows._array;
          if (isCategoryList(dbResult)) {
            resolve(dbResult);
          }
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

export function updateCategoryDb({ id, name, trimName }: Category) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE categories SET name = ?, trimName = ? WHERE id = ?;`,
        [name, trimName, id],
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
