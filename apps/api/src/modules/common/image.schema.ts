import { Schema } from "mongoose";

export const imageSchema = new Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false },
);

export type imageSchemaType = {
  url: string;
  publicId: string;
};
