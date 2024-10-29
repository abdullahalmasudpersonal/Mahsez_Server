import { model, Schema } from 'mongoose';
import { ProductModel, TProduct } from './product.interface';

const productSchema = new Schema<TProduct, ProductModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    mainCategory: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    subCategory: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: false,
    },
    availableQuantity: {
      type: Number,
      required: false,
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out Of Stock'],
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: false,
    },
    size: {
      type: String,
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
    description: {
      type: String,
      required: false,
    },
    description2: {
      type: [String],
      required: false,
    },
    image: {
      type: [String],
      required: false,
    },
    prodCreator: {
      type: String,
      required: [true, 'UserId is Required'],
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

productSchema.statics.isProductExistsByName = async function (name: string) {
  return await Product.findOne({ name });
};
export const Product = model<TProduct, ProductModel>('Product', productSchema);
