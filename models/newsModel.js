const mongoose = require("mongoose");
const NewsSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      // required: true,
    },
    hnUrl: {
      type: String,
      trim: true,
      // required: true,
    },
    title: {
      type: String,
      trim: true,
      // required: true,
    },
    // userId: { type: Schema.Types.ObjectId, ref: "User" },
    upVotes: {
      type: Number,
    },
    comments: {
      type: Number,
    },
    age: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("news", NewsSchema);
module.exports = News;
