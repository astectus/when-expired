/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactElement, useEffect, useMemo, useState } from 'react';
import Product, { NewProduct } from '../../models/Product';
import { deleteProduct, fetchProducts, insertProduct } from '../../utils/database';
import { isProduct } from '../../utils/typeChecker';

interface IProductContext {
  products: Product[];
  addProduct: (product: NewProduct) => void;
  removeProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
}

export const ProductsContext = createContext<IProductContext>({
  products: [],
  addProduct: (product: NewProduct) => {},
  removeProduct: (id: string) => {},
  updateProduct: (product: Product) => {},
});

function ProductsContextProvider({ children }: { children: ReactElement }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetch() {
      const products = await fetchProducts();
      setProducts(products);
    }

    fetch();
  }, []);

  async function addProduct(product: NewProduct) {
    if (isProduct(product)) {
      await insertProduct(product);
      const products = await fetchProducts();
      setProducts(products);
    }
  }

  async function removeProduct(id: string) {
    await deleteProduct(id);
    const products = await fetchProducts();
    setProducts(products);
  }

  function updateProduct(product: Product) {
    console.log(product);
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
