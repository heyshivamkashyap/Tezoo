import { Schema, model, Types, Document, HydratedDocument } from "mongoose";
import { imageSchema, imageSchemaType } from "../common/image.schema";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  brand: string;
  categoryId: Types.ObjectId;
  images: imageSchemaType[];
  tags?: string[]; // for seo
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    brand: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    images: {
      type: [imageSchema],
      required: true,
    },
    tags: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
// indexes
productSchema.index({ categoryId: 1 });
productSchema.index({ isActive: 1 });

export const ProductModel = model<IProduct>("Product", productSchema);
