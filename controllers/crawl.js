const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");
const news = require("../models/newsModel");

const extractNewsItems = async (pageUrl) => {
  try {
    // let arr = new Array();
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);
    $(".athing").each(async (index, element) => {
      // Extract the title
      const rank = $(element).find(".rank").text().trim();
      const title = $(element).find(".titleline").find("a").text().trim();
      const hackerNewsURL = $(element)
        .find(".titleline")
        .find("a")
        .attr("href");
      const url = $(element)
        .find(".titleline")
        .find(".sitebit")
        .find("a")
        .attr("href");

      // Extract the number of upvotes
      let upvotesText = $(element).next().find("span.score").text().trim();
      let upvotes = parseInt(upvotesText) || 0; // Convert to integer, default to 0 if NaN

      // Extract the number of comments
      let commentsText = $(element)
        .next()
        .find('a[href*="item?id="]')
        .text()
        .trim();
      let comments = parseInt(commentsText) || 0; // Convert to integer, default to 0 if NaN
      let age = $(element).next().find("span.age").text().trim();
      const data = {
        title: ` ${title}`,
        hnUrl: `${hackerNewsURL}`,
        url: `${url}`,
        upVotes: `${upvotes}`,
        comments: `${comments}`,
        age: `${age}`,
      };
      const exists = await news.findOne({ title });
      if (exists) {
        const updatedUser = await news.findOneAndUpdate(
          { title, hnUrl: hackerNewsURL, url },
          { $set: data },
          { new: true } // Return the updated document
        );
      } else {
        await news.create(data);
      }
    });
    // return arr;
  } catch (error) {
    console.log(error);
  }
};

const crawlHackerNews = async () => {
  const pages = 3;
  // let ans = new Array();
  const baseUrl = "https://news.ycombinator.com/";
  for (let pageNum = 0; pageNum < pages; pageNum++) {
    const pageUrl = pageNum === 0 ? baseUrl : `${baseUrl}?p=${pageNum + 1}`;
    await extractNewsItems(pageUrl);
    // ans = [...ans, ...res];
  }
  // return ans;
};

module.exports = crawlHackerNews;
