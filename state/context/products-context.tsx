/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactElement, useEffect, useMemo, useState } from 'react';
import Product, { NewProduct } from '../../models/Product';
import {
  deleteCategoryDb,
  deleteProductDb,
  fetchCategoriesDb,
  fetchProductsDb,
  insertCategoriesDb,
  insertCategoryDb,
  insertProductDb,
  updateCategoryDb,
  updateProductDb,
} from '../../utils/database';
import { isCategory, isProduct } from '../../utils/typeChecker';
import { Category, NewCategory } from '../../models/Category';

interface IProductContext {
  products: Product[];
  categories: Category[];
  addProduct: (product: NewProduct, categoryNames: string[]) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addCategory: (category: Category) => Promise<Category | undefined>;
  addCategories: (categories: string[]) => Promise<Category[] | undefined>;
  removeCategory: (id: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
}

export const ProductsContext = createContext<IProductContext>({
  products: [],
  categories: [],
  addProduct: async (product: NewProduct, categoryNames: string[]) => undefined,
  removeProduct: async (id: string) => undefined,
  updateProduct: async (product: Product) => undefined,
  addCategory: async (category: NewCategory) => undefined,
  addCategories: async (categoryName: string[]) => undefined,
  removeCategory: async (id: string) => undefined,
  updateCategory: async (category: Category) => undefined,
});

function ProductsContextProvider({ children }: { children: ReactElement }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetch() {
      const products = await fetchProductsDb();
      const categories = await fetchCategoriesDb();
      console.log(products);
      console.log(categories);
      setProducts(products);
      setCategories(categories);
    }

    fetch();
  }, []);

  async function removeProduct(id: string) {
    await deleteProductDb(id);
    const products = await fetchProductsDb();
    setProducts(products);
  }

  async function updateProduct(product: Product) {
    await updateProductDb(product);
    const products = await fetchProductsDb();
    setProducts(products);
  }

  async function addCategory(category: NewCategory) {
    if (isCategory(category)) {
      const newCategory = await insertCategoryDb(category);
      setCategories([...categories, newCategory]);
      return newCategory;
    }
    return undefined;
  }

  async function addCategories(categoryNames: string[]) {
    const categoriesToAdd: NewCategory[] = [];
    categoryNames.forEach((categoryName) => {
      const rawCategory = categoryName.trim().toLowerCase();
      const foundCategory = categories.find((category) => category.trimName !== rawCategory);
      if (!foundCategory) {
        categoriesToAdd.push({ name: categoryName, trimName: rawCategory });
      }
    });

    if (!categoriesToAdd.length) {
      return [];
    }
    const newCategories = await insertCategoriesDb(categoriesToAdd);
    setCategories([...categories, ...newCategories]);
    return newCategories;
  }

  async function removeCategory(id: string) {
    await deleteCategoryDb(id);
    const categories = await fetchCategoriesDb();
    const products = await fetchProductsDb();
    setCategories(categories);
    setProducts(products);
  }

  async function updateCategory(category: Category) {
    await updateCategoryDb(category);
    const categories = await fetchCategoriesDb();
    setCategories(categories);
  }

  async function addProduct(product: NewProduct, categories: Array<NewCategory | Category>) {
    if (isProduct(product)) {
      let categories: Category[] = [];
      if (categoryNames.length > 0) {
        const newCategories = await addCategories(categoryNames);
        // TODO: add many to many for product to category
        product.categoryIds = newCategories.map((category) => category.id);
      }
      await insertProductDb(product);
      const products = await fetchProductsDb();
      setProducts(products);
    }
  }

  const value = useMemo(
    () => ({
      products,
      addProduct,
      removeProduct,
      updateProduct,
      categories,
      addCategory,
      addCategories,
      updateCategory,
      removeCategory,
    }),
    [products, categories]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export default ProductsContextProvider;
