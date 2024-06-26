export interface NewProduct extends Omit<Product, 'id' | 'expirationDate'> {
  id?: string;
  expirationDate?: Date;
}
export default class Product {
  public id: string;

  public name: string;

  public expirationDate: string;

  public price?: string;

  public photoUri?: string;

  public description?: string;

  public isFavorite?: boolean;

  public categoryIds?: string[];

  constructor(data: NewProduct) {
    this.id = data.id || Math.random().toString();
    this.name = data.name;
    this.expirationDate = data.expirationDate ? data.expirationDate : new Date();
    this.price = data.price;
    this.photoUri = data.photoUri;
    this.description = data.description;
    this.categoryIds = data.categoryIds || [];
  }
}
