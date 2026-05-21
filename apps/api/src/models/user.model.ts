import { Schema, Types, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type UserRole =
  | "customer"
  | "store_owner"
  | "delivery_partner"
  | "admin";
export type UserStatus = "active" | "suspended" | "deleted";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;

  role: UserRole;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;

  profileImage?: string;

  status: UserStatus;

  defaultAddress?: Types.ObjectId;

  // compare password method
  comparePassword(userPassword: string): Promise<boolean>;

  // generate tokens method
  generateTokens(): { accessToken: string; refreshToken: string };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // don't return by default
    },

    role: {
      type: String,
      enum: ["customer", "store_owner", "delivery_partner", "admin"],
      default: "customer",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    defaultAddress: {
      type: Types.ObjectId,
      ref: "Address",
    },
  },
  { timestamps: true },
);

// indexes
userSchema.index({ roles: 1 });
userSchema.index({ status: 1 });

// hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password Compare Method
userSchema.methods.comparePassword = async function (
  this: IUser,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password);
};

// GENERATE ACCESS + REFRESH TOKEN
userSchema.methods.generateTokens = function (this: IUser) {
  const accessToken = jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
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
