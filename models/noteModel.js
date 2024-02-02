const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  desc: {
    type: String,
    trim: true,
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Note = mongoose.model("note", NoteSchema);
module.exports = Note;
