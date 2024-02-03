const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReadSchema = new mongoose.Schema({
  newsId: { type: Schema.Types.ObjectId, ref: "News" },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Read = mongoose.model("read", ReadSchema);
module.exports = Read;
