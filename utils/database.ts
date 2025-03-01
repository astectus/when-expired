import * as SQLite from 'expo-sqlite';
import Product from '../models/Product';
import { Category, NewCategory } from '../models/Category';
import { productMapFromDb } from './productMapFromBarcode';

// Initialize database
let database: SQLite.SQLiteDatabase;

// Initialize the database connection
export const initDatabase = async () => {
  database = await SQLite.openDatabaseAsync('places.db');
  await init();
};

export const init = async () => {
  database = await SQLite.openDatabaseAsync('places.db');
  try {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        trimName TEXT NOT NULL
      );
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        expirationDate TEXT NOT NULL,
        price TEXT,
        photoUri TEXT,
        description TEXT
      );
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS productCategories (
        id INTEGER PRIMARY KEY NOT NULL,
        productId INTEGER NOT NULL,
        categoryId INTEGER NOT NULL,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

export async function insertProductDb({
                                        name,
                                        expirationDate,
                                        price,
                                        photoUri,
                                        description,
                                      }: Product): Promise<Product> {
  try {
    // Insert the product
    const query = `
      INSERT INTO products (name, expirationDate, price, photoUri, description)
      VALUES ('${name}', '${expirationDate.toISOString()}', '${price || ''}', '${photoUri || ''}', '${description || ''}')
    `;
    await database.execAsync(query);

    // Get the last inserted row
    const result = await database.getAllAsync(`
      SELECT * FROM products WHERE id = last_insert_rowid()
    `);

    if (result && result.length > 0) {
      return result[0] as Product;
    }
    throw new Error('Failed to insert product');
  } catch (error) {
    console.error('Error inserting product:', error);
    throw error;
  }
}

export async function updateProductDb({
                                        id,
                                        name,
                                        expirationDate,
                                        price,
                                        photoUri,
                                        description,
                                      }: Product): Promise<Product> {
  try {
    const query = `
      UPDATE products
      SET name = '${name}',
          expirationDate = '${expirationDate.toISOString()}',
          price = '${price || ''}',
          photoUri = '${photoUri || ''}',
          description = '${description || ''}'
      WHERE id = ${id}
    `;
    await database.execAsync(query);

    // Get the updated row
    const result = await database.getAllAsync(`
      SELECT * FROM products WHERE id = ${id}
    `);

    if (result && result.length > 0) {
      return result[0] as Product;
    }
    throw new Error('Failed to update product');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function fetchProductsDb(): Promise<Product[]> {
  try {
    const result = await database.getAllAsync(`
      SELECT
        p.name,
        p.expirationDate,
        p.price,
        p.photoUri,
        p.description,
        p.id,
        GROUP_CONCAT(pc.categoryId,',') AS categoryIds
      FROM products p
      LEFT JOIN productCategories pc ON p.id = pc.productId
      GROUP BY p.id
      HAVING p.name IS NOT NULL
    `);

    if (result) {
      return productMapFromDb(result as any[]);
    }
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function deleteProductDb(id: string): Promise<any> {
  try {
    // Get the product before deleting
    const product = await database.getAllAsync(
      `SELECT * FROM products WHERE id = ${id}`
    );

    // Delete the product
    await database.execAsync(`DELETE FROM products WHERE id = ${id}`);

    if (product && product.length > 0) {
      return product[0];
    }
    return null;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function insertCategoryDb({ name, trimName }: NewCategory): Promise<Category> {
  try {
    await database.execAsync(
      `INSERT INTO categories (name, trimName) VALUES ('${name}', '${trimName}')`
    );

    const result = await database.getAllAsync(
      `SELECT * FROM categories WHERE id = last_insert_rowid()`
    );

    if (result && result.length > 0) {
      return result[0] as Category;
    }
    throw new Error('Failed to insert category');
  } catch (error) {
    console.error('Error inserting category:', error);
    throw error;
  }
}

export async function insertProductCategories(
  productId: string,
  categories: Category[]
): Promise<unknown> {
  try {
    if (categories.length === 0) return null;

    const values = categories.map(category =>
      `('${productId}', '${category.id}')`
    ).join(', ');

    await database.execAsync(
      `INSERT INTO productCategories (productId, categoryId) VALUES ${values}`
    );

    const result = await database.getAllAsync(
      `SELECT * FROM productCategories WHERE productId = '${productId}'`
    );

    if (result && result.length > 0) {
      return result;
    }
    return null;
  } catch (error) {
    console.error('Error inserting product categories:', error);
    throw error;
  }
}

export async function insertCategoriesDb(newCategories: NewCategory[]): Promise<Category[]> {
  try {
    if (newCategories.length === 0) return [];

    const values = newCategories.map(category =>
      `('${category.name}', '${category.trimName}')`
    ).join(', ');

    await database.execAsync(
      `INSERT INTO categories (name, trimName) VALUES ${values}`
    );

    // Get all the categories that match our newly inserted names
    const names = newCategories.map(cat => `'${cat.name}'`).join(',');
    const result = await database.getAllAsync(
      `SELECT * FROM categories WHERE name IN (${names})`
    );

    if (result && result.length > 0) {
      return result as Category[];
    }
    return [];
  } catch (error) {
    console.error('Error inserting categories:', error);
    throw error;
  }
}

export async function fetchCategoriesDb(): Promise<Category[]> {
  try {
    const result = await database.getAllAsync('SELECT * FROM categories');

    if (result) {
      return result as Category[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function deleteCategoryDb(id: string): Promise<Category | null> {
  try {
    // Get the category before deleting
    const category = await database.getAllAsync(
      `SELECT * FROM categories WHERE id = ${id}`
    );

    // Delete the category
    await database.execAsync(`DELETE FROM categories WHERE id = ${id}`);

    if (category && category.length > 0) {
      return category[0] as Category;
    }
    return null;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export async function updateCategoryDb({ id, name, trimName }: Category): Promise<Category> {
  try {
    await database.execAsync(
      `UPDATE categories SET name = '${name}', trimName = '${trimName}' WHERE id = ${id}`
    );

    const result = await database.getAllAsync(
      `SELECT * FROM categories WHERE id = ${id}`
    );

    if (result && result.length > 0) {
      return result[0] as Category;
    }
    throw new Error('Failed to update category');
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function fetchProductsByCategories(categories: Category[]): Promise<Product[]> {
  try {
    if (categories.length === 0) return [];

    const categoryIds = categories.map(c => `'${c.id}'`).join(',');

    const result = await database.getAllAsync(`
      SELECT
        p.name,
        p.expirationDate,
        p.price,
        p.photoUri,
        p.description,
        p.id,
        GROUP_CONCAT(pc.categoryId,',') AS categoryIds
      FROM products p
      JOIN productCategories pc ON p.id = pc.productId
      WHERE pc.categoryId IN (${categoryIds})
      GROUP BY p.id
    `);

    if (result) {
      return productMapFromDb(result as any[]);
    }
    return [];
  } catch (error) {
    console.error('Error fetching products by categories:', error);
    throw error;
  }
}