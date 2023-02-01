
export interface BarCodeProduct {
 product: {
     artist: string;
     attributes: Record<string, string>;
     barcode_formats: Record<string, string>;
     brand: Record<string, string>;
     category: Array<string>;
     description: string;
     features:Record<string, string>;
     images: Array<string>;
     ingredients:Record<string, string>;
     manufacturer: string;
     online_stores: Array<{name: string, price: string, url: string}>;
     title: string;
 }
}
