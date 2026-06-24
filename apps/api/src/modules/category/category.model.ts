import { Schema, model, Types, Document, HydratedDocument } from "mongoose";
import { imageSchema, imageSchemaType } from "../common/image.schema";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: imageSchemaType;

  // null = main category
  // has value = subcategory
  parentId?: Types.ObjectId | null;

  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
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
    },
    image: imageSchema,
    parentId: {
      type: Types.ObjectId,
      ref: "Category",
      default: null,
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
categorySchema.index({ parentId: 1 });
categorySchema.index({ isActive: 1 });

// same slug allowed in different parent categories
categorySchema.index({ slug: 1, parentId: 1 }, { unique: true });

export const CategoryModel = model<ICategory>("Category", categorySchema);
