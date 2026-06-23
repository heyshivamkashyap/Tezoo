import { Schema, model, Types, Document, HydratedDocument } from "mongoose";

export type StoreStatus = "pending" | "active" | "suspended";

export interface IStore extends Document {
  name: string;
  storeCode: string;

  status: StoreStatus;

  phone: string;
  email?: string | null;

  address: Types.ObjectId;

  geoLocation: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  isOpen: boolean;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    storeCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      minlength: 6,
      maxlength: 6,
    },

    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
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

    isOpen: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

storeSchema.index({ geoLocation: "2dsphere" });
storeSchema.index({ status: 1 });

export const StoreModel = model<IStore>("Store", storeSchema);
