import { Schema, model, Types, Document } from "mongoose";

export type OrderStatus =
  | "created"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "prepaid";
export type DeliveryType = "delivery" | "takeaway";

interface IOrderItem {
  inventoryId: Types.ObjectId;
  name: string;
  image?: string;
  packSize: number;
  unit: string;
  quantity: number;
  mrp: number;
  price: number;
  total: number;
}

export interface IOrder extends Document {
  orderNo: string;
  user: Types.ObjectId;
  storeId: Types.ObjectId;
  deliveryPartnerId?: Types.ObjectId;
  items: IOrderItem[];
  deliveryAddress?: Types.ObjectId;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  status: OrderStatus;
  cancelReason?: string;
  confirmedAt?: Date;
  packedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    deliveryPartnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        inventoryId: {
          type: Schema.Types.ObjectId,
          ref: "StoreInventory",
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        image: {
          type: String,
        },

        packSize: {
          type: Number,
          required: true,
          min: 1,
        },

        unit: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        mrp: {
          type: Number,
          required: true,
          min: 0,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "upi", "card"],
      required: true,
    },

    deliveryType: {
      type: String,
      enum: ["delivery", "takeaway"],
      default: "delivery",
    },

    status: {
      type: String,
      enum: [
        "created",
        "confirmed",
        "packed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "created",
      index: true,
    },

    cancelReason: {
      type: String,
      trim: true,
    },

    confirmedAt: {
      type: Date,
    },

    packedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// indexes
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const OrderModel = model<IOrder>("Order", orderSchema);
