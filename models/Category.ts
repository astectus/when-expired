export interface NewCategory extends Omit<Category, 'id'> {
  id?: string;
}
export interface Category {
  id: string;
  name: string;
  trimName: string;
}
