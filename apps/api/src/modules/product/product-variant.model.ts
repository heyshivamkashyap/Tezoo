import { Schema, model, Types, Document, HydratedDocument } from "mongoose";

export interface IProductVariant extends Document {
  productId: Types.ObjectId;
  sku: string; // e.g. -> amul-milk-500ml
  unit: string; // ml, g, kg, ltr
  mrp: number;
  barcode?: string;
  weight?: number;
  isActive: boolean;
}

const variantSchema = new Schema<IProductVariant>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    unit: {
      type: String,
    },
    mrp: {
      type: Number,
      required: true,
    },
    barcode: {
      type: String,
    },

    weight: {
      type: Number,
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
variantSchema.index({ productId: 1 });
variantSchema.index({ isActive: 1 });
variantSchema.index({ productId: 1, unit: 1, packSize: 1 }, { unique: true });

export const ProductVariantModel = model<IProductVariant>(
  "ProductVariant",
  variantSchema,
);
