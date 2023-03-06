/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactElement, useEffect, useMemo, useState } from 'react';
import Product, { NewProduct } from '../../models/Product';
import {
  deleteProductDb,
  fetchProductsDb,
  insertProductDb,
  updateProductDb,
} from '../../utils/database';
import { isProduct } from '../../utils/typeChecker';

interface IProductContext {
  products: Product[];
  addProduct: (product: NewProduct) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
}

export const ProductsContext = createContext<IProductContext>({
  products: [],
  addProduct: async (product: NewProduct) => {},
  removeProduct: async (id: string) => {},
  updateProduct: async (product: Product) => {},
});

function ProductsContextProvider({ children }: { children: ReactElement }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetch() {
      const products = await fetchProductsDb();
      setProducts(products);
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

  const value = useMemo(() => {
    return {
      products,
      addProduct,
      removeProduct,
      updateProduct,
    };
  }, [products]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export default ProductsContextProvider;
