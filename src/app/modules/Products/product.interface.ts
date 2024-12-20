import { Model } from 'mongoose';

export type TProduct = {
  productId: string;
  mainCategory: string;
  category: string;
  subCategory: string;
  name: string;
  brand: string;
  availableQuantity: number;
  stockStatus: 'In Stock' | 'Out Of Stock';
  price: number;
  purchaseprice: number;
  profit: number;
  regularPrice: number;
  offerPrice?: number;
  size: string;
  features: string;
  features2?: string[];
  description: string;
  description2?: string[];
  image?: string[];
  soldQuantity?: number;
  prodCreator: string;
  isDeleted: boolean;
};

export interface ProductModel extends Model<TProduct> {
  isProductExistsByName(name: string): Promise<TProduct>;
}
