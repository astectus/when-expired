interface NewProduct extends Omit<Product, 'id'> {
  id?: string;
}
export default class Product {
  public id: string;

  public name: string;

  public expirationDate: string; // Date;

  public price?: string;

  public photoUri?: string;

  public description?: string;

  constructor(data: NewProduct) {
    this.id = data.id || Math.random().toString();
    this.name = data.name;
    this.expirationDate = data.expirationDate; // new Date(expirationDate);
    this.price = data.price;
    this.photoUri = data.photoUri;
    this.description = data.description;
  }
}
