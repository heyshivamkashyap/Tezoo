import { Schema, model, Types, Document } from "mongoose";

interface ICartItem {
  inventoryId: Types.ObjectId;
  quantity: number;
  price: number; // snapshot
  name: string; // snapshot
  image?: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  storeId: Types.ObjectId;
  items: ICartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    items: [
      {
        inventoryId: {
          type: Schema.Types.ObjectId,
          ref: "StoreInventory",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

// one cart per store per user
cartSchema.index({ userId: 1, storeId: 1 }, { unique: true });

export const CartModel = model<ICart>("Cart", cartSchema);
