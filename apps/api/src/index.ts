import express from "express";

const app = express();

const PORT = 8000;

app.get("/", (_, res) => {
  res.json({ message: "running" });
});

app.listen(8000, () => {
  console.log(`⚙️- Server is running at port : ${PORT}`);
});
