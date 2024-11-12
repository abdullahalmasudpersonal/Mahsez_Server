import { model, Schema } from 'mongoose';
import { BlogModel, TBlog } from './blog.interface';

const blogSchema = new Schema<TBlog, BlogModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    description2: {
      type: [String],
      required: false,
    },
    features: {
      type: String,
      required: false,
    },
    features2: {
      type: [String],
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    writer: {
      type: String,
      required: true,
      unique: false,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

blogSchema.statics.isBlogExistsByTitle = async function (title: string) {
  return await Blog.findOne({ title });
};

export const Blog = model<TBlog, BlogModel>('Blog', blogSchema);
