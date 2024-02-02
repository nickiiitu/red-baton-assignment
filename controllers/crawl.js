const axios = require("axios");
const cheerio = require("cheerio");

// import axios from "axios";
// import cheerio from "cheerio";

const BASE_URL = "https://news.ycombinator.com/";
const PAGES_TO_CRAWL = 3;

const extractNewsItems = (html) => {
  console.log(html);
  const $ = cheerio.load(html);
  const newsItems = [];
  $(".itemlist .athing").each((index, element) => {
    console.log(element);
    const title = $(element).find(".title a").text().trim();
    const url = $(element).find(".title a").attr("href");
    const hnUrl = `${BASE_URL}${url}`;
    const postedOn = $(element).next().find(".age").text().trim();
    const upvotes = $(element).next().find(".score").text().trim();
    const comments = $(element)
      .next()
      .find('a:contains("comment")')
      .text()
      .trim();

    newsItems.push({
      title,
      url: url ? hnUrl : null,
      hnUrl,
      postedOn,
      upvotes,
      comments,
    });
  });

  return newsItems;
};

const crawlHackerNews = async () => {
  let ans = new Array();
  try {
    for (let page = 1; page <= PAGES_TO_CRAWL; page++) {
      const url = page === 1 ? BASE_URL : `${BASE_URL}news?p=${page}`;
      //   const url = BASE_URL;
      const response = await axios.get(url);
      // console.log(response.data);
      if (response.status === 200) {
        const newsItems = extractNewsItems(response.data);
        console.log(`Page ${page} - News Items:`, newsItems);
        ans = [...ans, ...newsItems];
      } else {
        console.error(`Failed to fetch data from page ${page}`);
      }
    }
    return ans;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

module.exports = crawlHackerNews;
