import { Model, Types } from 'mongoose';

export type TBlog = {
  title: string;
  description: string;
  description2?: string[];
  features?: string;
  features2?: string[];
  image?: string;
  writer: string;
  isDeleted: boolean;
};

export interface BlogModel extends Model<TBlog> {
  isBlogExistsByTitle(title: string): Promise<TBlog>;
}
