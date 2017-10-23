const fetch = require('node-fetch');
const cheerio = require('cheerio');
require('dotenv').config();

const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_API_KEY,
  consumer_secret: process.env.CONSUMER_API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const params = {screen_name: 'azamatsmith'};

const getBooks = (callback = null) => {
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      let textSearch = tweets.filter(tweet =>
        tweet.text.toLowerCase().match('finished listening to'),
      );

      const audibleTag = tweets.filter(tweet => {
        const tags = tweet.entities.hashtags.map(tag => tag.text.toLowerCase());
        if (tags.indexOf('audible') >= 0) {
          return true;
        }
        return false;
      });

      const bookTag = tweets.filter(tweet => {
        const tags = tweet.entities.hashtags.map(tag => tag.text.toLowerCase());
        if (tags.indexOf('book') >= 0 || tags.indexOf('books') >= 0) {
          return true;
        }
        return false;
      });

      const readingTag = tweets.filter(tweet => {
        const tags = tweet.entities.hashtags.map(tag => tag.text.toLowerCase());
        if (tags.indexOf('reading') >= 0) {
          return true;
        }
        return false;
      });

      textSearch = textSearch
        .concat(audibleTag)
        .concat(bookTag)
        .concat(readingTag)
        .map(tweet => {
          const {created_at, entities, id, text} = tweet;
          return {
            created_at,
            id,
            text,
            url: entities.urls[0],
          };
        })
        .filter(
          (tweet, index, self) =>
            self.findIndex(t => t.id === tweet.id) === index,
        );
      callback(textSearch);
    }
  });
};

const getImage = (link = null, callback = null) => {
  if (!link) {
    return callback({error: 'must provide a link'});
  }

  fetch(link)
    .then(res => res.text())
    .then(text => {
      const $ = cheerio.load(text);
      const image = $('meta[property="og:image"]').attr('content');
      callback(image);
    })
    .catch(error => callback({error}));
};

module.exports = {getBooks, getImage};
