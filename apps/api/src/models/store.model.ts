import { Schema, model, Types, Document } from "mongoose";

export type StoreStatus = "pending" | "active" | "suspended";

export interface IStore extends Document {
  name: string;
  slug: string;
  ownerId: Types.ObjectId;

  phone: string;
  store_email: string;

  address: Types.ObjectId;

  geoLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  currentLoad: number;

  isOpen: boolean;
  status: StoreStatus;

  serviceRadiusKm: number;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    store_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    address: {
      type: Types.ObjectId,
      ref: "Address",
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
      index: true,
    },

    serviceRadiusKm: {
      type: Number,
      required: true,
      default: 3,
    },
  },

  {
    timestamps: true,
  },
);

// INDEXES
storeSchema.index({ geoLocation: "2dsphere" });
storeSchema.index({ status: 1, geoLocation: "2dsphere" });
storeSchema.index({ ownerId: 1 });
storeSchema.index({ currentLoad: 1 });

export const StoreModel = model("Store", storeSchema);
