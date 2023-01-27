export default class Product {
     public id: string;

     public name: string;

     public expirationDate: string // Date;

     public price?: string;

     public photoUri?: string;

     public description?: string;

     constructor(id: string, name: string, expirationDate: string, price?: string, photoUri?: string, description?: string) {
           this.id = id;
           this.name = name;
           this.expirationDate = expirationDate // new Date(expirationDate);
           this.price = price;
           this.photoUri = photoUri;
           this.description = description;
     }
}