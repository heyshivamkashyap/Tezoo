import { Schema, model, Types, Document, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";

export type UserRole =
  | "customer"
  | "admin"
  | "store_manager"
  | "support"
  | "delevery_partner";

export type UserStatus = "pending" | "active" | "blocked" | "deleted";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  password: string;

  roles: UserRole[];
  status: UserStatus;

  profileImage?: string;

  defaultAddress?: Types.ObjectId;

  emailVerifiedAt?: Date | null;
  phoneVerifiedAt?: Date | null;
  deletedBy?: Types.ObjectId;

  comparePassword(password: string): Promise<boolean>;

  // compare password method
  comparePassword(userPassword: string): Promise<boolean>;

  // generate tokens method
  generateTokens(): { accessToken: string; refreshToken: string };
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    roles: {
      type: [String],
      enum: [
        "customer",
        "admin",
        "store_manager",
        "support",
        "delivery_partner",
      ],
      default: ["customer"],
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "blocked", "deleted"],
      default: "pending",
      index: true,
    },

    profileImage: {
      type: String,
    },

    defaultAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    phoneVerifiedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// indexes
userSchema.index({ roles: 1, status: 1 });

// hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Password Compare Method
userSchema.methods.comparePassword = async function (
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

// GENERATE ACCESS + REFRESH TOKEN
userSchema.methods.generateTokens = function (this: UserDocument) {
  const accessToken = jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.roles,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: this._id,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // return both tokens
  return { accessToken, refreshToken };
};

export const UserModel = model<IUser>("User", userSchema);
export type UserDocument = HydratedDocument<IUser>;
