const express = require("express");
const route = express.Router();
const {
  createNote,
  getNote,
  deleteNote,
} = require("../controllers/noteControllers");

route.post("/", createNote);
route.get("/:userId", getNote);
route.delete("/:id", deleteNote);
module.exports = route;
