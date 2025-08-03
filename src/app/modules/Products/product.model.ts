import { model, Schema } from 'mongoose';
import { ProductModel, TProduct } from './product.interface';

const productSchema = new Schema<TProduct, ProductModel>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    mainCategory: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out Of Stock'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    purchaseprice: {
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
    profit: {
      type: Number,
      required: false,
    },
    size: {
      type: String,
      required: true,
    },
    features: {
      type: String,
      required: true,
    },
    features2: {
      type: [String],
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
      required: false,
    },
    image: {
      type: [String],
      required: false,
    },
    soldQuantity: {
      type: Number,
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
