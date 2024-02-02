const news = require("../models/newsModel");
const user = require("../models/userModel");
const crawlHackerNews = require("./crawl");
const createNews = async (req, res) => {
  try {
    const { title, desc, id } = req.body;
    const userExists = await user.findOne({ _id: id });
    if (req.body.noteId) {
      const noteId = req.body.noteId;
      const updatedDocument = await news.findOneAndUpdate(
        { _id: noteId },
        { $set: { title, desc, userId: id } },
        { new: true, useFindAndModify: false }
      );
      res.status(200).send(updatedDocument);
    } else {
      if (userExists) {
        const newNote = await news.create({
          title,
          desc,
          userId: id,
        });
        if (newNote) {
          res.status(200).send(newNote);
        }
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

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

const deleteNews = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDocument = await news.findOneAndDelete({ _id: id });
    console.log(deletedDocument);
    res.status(200).send(deletedDocument);
  } catch (error) {}
};
module.exports = { createNews, getNews, deleteNews };
