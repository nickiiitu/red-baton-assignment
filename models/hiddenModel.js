const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HiddenSchema = new mongoose.Schema({
  newsId: { type: Schema.Types.ObjectId, ref: "News" },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Hidden = mongoose.model("hidden", HiddenSchema);

module.exports = Hidden;
