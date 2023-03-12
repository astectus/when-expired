import { BarCodeProduct } from '../models/BarCodeProduct';
import Product, { NewProduct } from '../models/Product';

export function productMapFromBarcode({ product }: BarCodeProduct): {
  product: NewProduct;
  categoryNames: string[];
} {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { title, description, images, online_stores } = product;
  const [photoUri] = images;

  return {
    product: {
      name: title,
      description,
      photoUri,
      price: online_stores[0]?.price,
      expirationDate: new Date(),
    },
    categoryNames: product.category || [],
  };
}
export function productMapFromDb(dbProducts: any[]): Product[] {
  return dbProducts.map(
    (dp) =>
      new Product({
        id: dp.id.toString(),
        name: dp.name,
        expirationDate: new Date(dp.expirationDate),
        price: dp.price,
        photoUri: dp.photoUri,
        description: dp.description,
        categoryIds: dp.categoryIds.split(','),
      })
  );
}
