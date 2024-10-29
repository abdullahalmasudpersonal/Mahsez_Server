import { Model, Types } from 'mongoose';

export type TProduct = {
  id: string;
  mainCategory?: string;
  category?: string;
  subCategory?: string;
  name: string;
  brand?: string;
  availableQuantity?: number;
  stockStatus?: 'inStock' | 'outOfStock';
  price: number;
  regularPrice: number;
  offerPrice?: number;
  size?: string;
  features?: string;
  features2?: string[];
  description?: string;
  description2?: string[];
  image?: string[];
  prodCreator: string;
  isDeleted: boolean;
};

export interface ProductModel extends Model<TProduct> {
  isProductExistsByName(name: string): Promise<TProduct>;
}
