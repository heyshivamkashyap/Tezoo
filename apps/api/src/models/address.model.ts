import { Schema, model, Types, Document } from "mongoose";

export type AddressType = "home" | "work" | "other";

export interface IAddress extends Document {
  userId: Types.ObjectId;

  label?: string; // e.g. "Home", "Office"
  type: AddressType;

  name: string; // receiver name
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  landmark?: string;

  city: string;
  state: string;
  pincode: string;

  deliveryInstructions?: string;

  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    addressLine1: {
      type: String,
      required: true,
    },

    addressLine2: {
      type: String,
    },

    landmark: {
      type: String,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
      index: true,
    },

    deliveryInstructions: {
      type: String,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Geo index for nearby queries
addressSchema.index({ location: "2dsphere" });

// Ensure only one default address per user
addressSchema.index(
  { userId: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } },
);

export const AddressModel = model<IAddress>("Address", addressSchema);
