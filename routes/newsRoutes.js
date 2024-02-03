const express = require("express");
const route = express.Router();
const {
  getNews,
  newsRead,
  checkVisited,
  newsHide,
  getHidden,
} = require("../controllers/newsControllers");

route.get("/", getNews);
route.post("/read", newsRead);
route.get("/read/:userId/", checkVisited);
route.post("/hidden", newsHide);
route.get("/hidden/:userId/", getHidden);
module.exports = route;
