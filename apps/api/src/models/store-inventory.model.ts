import { Schema, model, Types, Document } from "mongoose";

export interface IStoreInventory extends Document {
  storeId: Types.ObjectId;
  variantId: Types.ObjectId;
  stockQty: number;
  reservedQty: number;
  sellingPrice: number;
  mrp: number;
  lowStockThreshold: number;
  isAvailable: boolean;
}

const storeInventorySchema = new Schema<IStoreInventory>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    stockQty: {
      type: Number,
      default: 0,
    },
    reservedQty: {
      type: Number,
      default: 0,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate entry per store + variant
storeInventorySchema.index({ storeId: 1, variantId: 1 }, { unique: true });

// query optimization
storeInventorySchema.index({
  storeId: 1,
  isAvailable: 1,
});

storeInventorySchema.index({
  variantId: 1,
});

export const StoreInventoryModel = model<IStoreInventory>(
  "StoreInventory",
  storeInventorySchema,
);
