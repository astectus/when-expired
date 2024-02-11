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
  insertProductCategoriesV2,
  insertProductDb,
  updateCategoryDb,
  updateProductDb,
} from '../../utils/database';
import { isCategory, isProduct } from '../../utils/typeChecker';
import { Category, NewCategory } from '../../models/Category';

interface IProductContext {
  products: Product[];
  categories: Category[];
  addProduct: (product: NewProduct, categoryNames: NewCategory[]) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addCategory: (category: NewCategory) => Promise<Category | undefined>;
  addCategories: (categories: NewCategory[]) => Promise<Category[] | undefined>;
  removeCategory: (id: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
}

export const ProductsContext = createContext<IProductContext>({
  products: [],
  categories: [],
  addProduct: async (product: NewProduct, categoryNames: NewCategory[]) => undefined,
  removeProduct: async (id: string) => undefined,
  updateProduct: async (product: Product) => undefined,
  addCategory: async (category: NewCategory) => undefined,
  addCategories: async (categoryName: NewCategory[]) => undefined,
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

  async function addCategories(newCategories: NewCategory[]) {
    const categoriesToAdd: NewCategory[] = [];
    newCategories.forEach((newCategory) => {
      const foundCategory = categories.find(
        (category) => category.trimName === newCategory.trimName
      );
      if (!foundCategory) {
        categoriesToAdd.push(newCategory);
      }
    });

    if (!categoriesToAdd.length) {
      return [];
    }
    const addedCategories = await insertProductCategoriesV2(categoriesToAdd);
    console.log(addedCategories);
    setCategories([...categories, ...addedCategories]);
    return addedCategories;
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
      let productCategories: Category[] = [];
      if (categories.length > 0) {
        productCategories = await addCategories(categories);
        // TODO: add many to many for product to category
      }
      const addedProduct = await insertProductDb(product);

      if (productCategories.length > 0) {
      }
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
