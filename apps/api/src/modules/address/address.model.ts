import { Schema, model, Types, Document, HydratedDocument } from "mongoose";

export type AddressType = "home" | "work" | "other";

export interface IAddress extends Document {
  user: Types.ObjectId;
  label: string;
  type: AddressType;
  fullName: string;
  phone: string;

  line1: string;
  line2?: string | null;
  landmark?: string | null;

  deliveryInstructions?: string;

  geoLocation?: {
    type: "Point";
    coordinates: [number, number];
  }; // [lng, lat]
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    label: { type: String, trim: true },

    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    landmark: { type: String, trim: true },

    deliveryInstructions: {
      type: String,
    },

    geoLocation: {
      type: {
        type: String,
        required: true,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
  },
  { timestamps: true, versionKey: false },
);

// Geo index for nearby queries
addressSchema.index({ user: 1 });
addressSchema.index({ geoLocation: "2dsphere" });

export const AddressModel = model<IAddress>("Address", addressSchema);
