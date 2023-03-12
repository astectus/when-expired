import { BarCodeProduct } from '../models/BarCodeProduct';
import { NewProduct } from '../models/Product';

export function productMap({ product }: BarCodeProduct): NewProduct {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { title, description, images, online_stores } = product;
  const [photoUri] = images;

  return {
    name: title,
    description,
    photoUri,
    price: online_stores[0]?.price,
    expirationDate: new Date(),
    tempCategories: product.category || [],
  };
}
