import axios from 'axios';
import { NewProduct } from '../models/Product';
import { productMapFromBarcode } from '../utils/productMapFromBarcode';

export async function getProductByBarcode(
  barcode: string
): Promise<{ product: NewProduct; categoryNames: string[] } | null> {
  const options = {
    method: 'GET',
    url: 'https://barcodes1.p.rapidapi.com/',
    params: { query: barcode },
    headers: {
      'X-RapidAPI-Key': '304c8cdd8cmshb38eb0c42fd9110p1027bcjsn72ebb007af30',
      'X-RapidAPI-Host': 'barcodes1.p.rapidapi.com',
    },
  };

  const response = await axios(options);
  const data = await response.data;

  if (data?.results?.length === 0) {
    return null;
  }

  return productMapFromBarcode(data);
}
