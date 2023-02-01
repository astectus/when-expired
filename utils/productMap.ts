import { BarCodeProduct } from '../models/BarCodeProduct';
import Product from '../models/Product';

export function productMap({product}: BarCodeProduct): Partial<Product> {
     const {title, description, images, online_stores} = product;
     const [photoUri] = images;
     
     return {
     name: title,
     description,
     photoUri,
     price: online_stores[0]?.price,
     };

}