/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactElement, useEffect, useMemo, useState } from 'react';
import Product, { NewProduct } from '../../models/Product';
import {
  deleteCategoryDb,
  deleteProductDb,
  fetchCategoriesDb,
  fetchProductsDb,
  insertProductDb,
  updateProductDb,
} from '../../utils/database';
import { isCategory, isProduct } from '../../utils/typeChecker';
import { Category, NewCategory } from '../../models/Category';

interface IProductContext {
  products: Product[];
  categories: Category[];
  addProduct: (product: NewProduct) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
}

export const ProductsContext = createContext<IProductContext>({
  products: [],
  categories: [],
  addProduct: async (product: NewProduct) => {},
  removeProduct: async (id: string) => {},
  updateProduct: async (product: Product) => {},
  addCategory: async (category: NewCategory) => {},
  removeCategory: async (id: string) => {},
});

function ProductsContextProvider({ children }: { children: ReactElement }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetch() {
      const products = await fetchProductsDb();
      const categories = await fetchCategoriesDb();
      setProducts(products);
      setCategories(categories);
    }

    fetch();
  }, []);

  async function addProduct(product: NewProduct) {
    if (isProduct(product)) {
      await insertProductDb(product);
      const products = await fetchProductsDb();
      setProducts(products);
    }
  }

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
      await isCategory(category);
      const categories = await fetchCategoriesDb();
      setCategories(categories);
    }
  }

  async function removeCategory(id: string) {
    await deleteCategoryDb(id);
    const categories = await fetchCategoriesDb();
    setCategories(categories);
  }

  const value = useMemo(() => {
    return {
      products,
      categories,
      addCategory,
      removeCategory,
      addProduct,
      removeProduct,
      updateProduct,
    };
  }, [products, categories]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export default ProductsContextProvider;
