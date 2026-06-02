import mongoose from "mongoose";
import { env } from "./env";

const connectDb = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("DB Connected Successfully !!");
  } catch (error) {
    console.error("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDb;
