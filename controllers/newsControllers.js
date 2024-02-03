const news = require("../models/newsModel");
const user = require("../models/userModel");
const read = require("../models/readModel");
const hidden = require("../models/hiddenModel");
const crawlHackerNews = require("./crawl");

const getNews = async (req, res) => {
  try {
    await crawlHackerNews();
    const newArr = await news.find({});
    newArr.sort((a, b) => a.updatedAt - b.updatedAt);
    res.status(200).send(newArr);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const newsRead = async (req, res) => {
  const { newsId, userId } = req.body;
  try {
    if (newsId && userId) {
      const userExists = await user.findOne({ _id: userId });
      const newsExists = await news.findOne({ _id: newsId });
      if (userExists && newsExists) {
        const readExists = await read.findOne({ newsId });
        let newRead;
        if (readExists) {
          const index = readExists.users.findIndex((e) => e === userId);
          if (index !== -1) {
            res.status(200).send("already read");
            return;
          } else {
            readExists.users.push(userId);
            newRead = await read.findOneAndUpdate(
              { newsId },
              { $set: readExists },
              { new: true }
            );
          }
        } else {
          newRead = await read.create({
            newsId,
            users: [userId],
          });
        }
        res.status(200).send(newRead);
      } else {
        throw new Error("UserId not found");
      }
    } else {
      throw new Error("NewsId or UserId not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
const checkVisited = async (req, res) => {
  const { userId } = req.params;
  try {
    const news = await read.find({});
    res.status(200).send(news);
  } catch (error) {
    console.log(error);
  }
};

const getHidden = async (req, res) => {
  const { userId } = req.params;
  try {
    const news = await hidden.find({});
    res.status(200).send(news);
  } catch (error) {
    console.log(error);
  }
};
const newsHide = async (req, res) => {
  const { newsId, userId } = req.body;
  try {
    if (newsId && userId) {
      const userExists = await user.findOne({ _id: userId });
      const newsExists = await news.findOne({ _id: newsId });
      if (userExists && newsExists) {
        const readExists = await hidden.findOne({ newsId });
        let newRead;
        if (readExists) {
          const index = readExists.users.findIndex((e) => e === userId);
          if (index !== -1) {
            res.status(200).send("already read");
            return;
          } else {
            readExists.users.push(userId);
            newRead = await hidden.findOneAndUpdate(
              { newsId },
              { $set: readExists },
              { new: true }
            );
          }
        } else {
          newRead = await hidden.create({
            newsId,
            users: [userId],
          });
        }
        res.status(200).send(newRead);
      } else {
        throw new Error("UserId not found");
      }
    } else {
      throw new Error("NewsId or UserId not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
module.exports = { getNews, newsRead, checkVisited, getHidden, newsHide };
