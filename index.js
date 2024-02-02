const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/authRoutes");
const newsRoute = require("./routes/newsRoutes");
const mongoose = require("mongoose");
// const authRoute=require("./routes/")
dotenv.config();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", authRoute);
app.use("/api/news", newsRoute);
const connectDb = async () => {
  try {
    const res = await mongoose.connect(process.env.mongo);
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
};
connectDb();
app.listen("5000", () => {
  console.log("listening");
});
