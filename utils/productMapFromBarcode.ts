import { BarCodeProduct } from '../models/BarCodeProduct';
import Product, { NewProduct } from '../models/Product';
import { NewCategory } from '../models/Category';
import { tr } from 'react-native-paper-dates';

export function productMapFromBarcode({ product }: BarCodeProduct): {
  product: NewProduct;
  categories: NewCategory[];
} {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { title, description, images, online_stores, category } = product;
  const [photoUri] = images;
  const categories: NewCategory[] | undefined = category?.map((c) => {
    return {
      name: c,
      trimName: c.toLowerCase().replace(/\s/g, ''),
    };
  });

  return {
    product: {
      name: title,
      description,
      photoUri,
      price: online_stores[0]?.price,
      expirationDate: new Date(),
    },
    categories,
  };
}
export function productMapFromDb(dbProducts: any[]): Product[] {
  return dbProducts.map(
    (dp) =>
      new Product({
        id: dp.id?.toString(),
        name: dp.name,
        expirationDate: new Date(dp.expirationDate),
        price: dp.price,
        photoUri: dp.photoUri,
        description: dp.description,
        categoryIds: dp.categoryIds?.split(','),
      })
  );
}
