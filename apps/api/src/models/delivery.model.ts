import { Schema, model, Types, Document } from "mongoose";

export type DeliveryStatus =
  | "assigned"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface IDelivery extends Document {
  orderId: Types.ObjectId;
  riderId: Types.ObjectId;
  status: DeliveryStatus;
  etaMinutes?: number;
}

const deliverySchema = new Schema<IDelivery>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    riderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "assigned",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "assigned",
    },
  },
  {
    timestamps: true,
  },
);

deliverySchema.index({ riderId: 1 });
deliverySchema.index({ status: 1 });

export const DeliveryModel = model<IDelivery>("Delivery", deliverySchema);
