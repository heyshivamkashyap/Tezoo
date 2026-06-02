import dotenv from "dotenv";
import app from "./app";
import { env } from "./config/env";
import connectDb from "./config/db";

dotenv.config();

const PORT = env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️- Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO db connection failed !! ", err);
  });
