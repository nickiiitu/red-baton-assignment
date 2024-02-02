const express = require("express");
const route = express.Router();
const {
  createNews,
  getNews,
  deleteNews,
} = require("../controllers/newsControllers");

// route.post("/", createNews);
route.get("/", getNews);
route.delete("/:id", deleteNews);
module.exports = route;
