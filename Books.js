const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Twitter = require('twitter');
require('dotenv').config();

class Books {
  constructor() {
    this.params = {screen_name: 'azamatsmith'};
    this.client = new Twitter({
      consumer_key: process.env.CONSUMER_API_KEY,
      consumer_secret: process.env.CONSUMER_API_SECRET,
      access_token_key: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    });

    // bindings
    this.getBooks = this.getBooks.bind(this);
    this.getImage = this.getImage.bind(this);
    this._filterTweets = this._filterTweets.bind(this);
  }

  getBooks(callback = null) {
    this.client.get(
      'statuses/user_timeline',
      this.params,
      (error, tweets, response) => {
        if (error) {
          return {error};
        }
        let textSearch = tweets.filter(tweet =>
          tweet.text.toLowerCase().match('finished listening to'),
        );

        const audibleTag = tweets.filter(tweet => {
          const tags = tweet.entities.hashtags.map(tag =>
            tag.text.toLowerCase(),
          );
          if (tags.indexOf('audible') >= 0) {
            return true;
          }
          return false;
        });

        const bookTag = tweets.filter(tweet => {
          const tags = tweet.entities.hashtags.map(tag =>
            tag.text.toLowerCase(),
          );
          if (tags.indexOf('book') >= 0 || tags.indexOf('books') >= 0) {
            return true;
          }
          return false;
        });

        const readingTag = tweets.filter(tweet => {
          const tags = tweet.entities.hashtags.map(tag =>
            tag.text.toLowerCase(),
          );
          if (tags.indexOf('reading') >= 0) {
            return true;
          }
          return false;
        });

        textSearch = textSearch
          .concat(audibleTag)
          .concat(bookTag)
          .concat(readingTag);

        const filtered = this._filterTweets(textSearch);
        callback(filtered);
      },
    );
  }

  getImage(link = null, res = null) {
    if (!link) {
      res.status(500);
      return res({error: 'must provide a link'});
    }

    const string =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

    const headers = new Headers({
      // "Accept"       : "application/json",
      // "Content-Type" : "application/json",
      'User-Agent': string,
    });

    fetch(link, {headers})
      .then(response => response.text())
      .then(text => {
        const $ = cheerio.load(text);
        const image = $('meta[property="og:image"]').attr('content');
        console.log('got image!', image);
        res.json({link: image});
      })
      .catch(error => {
        console.log('got error: ', error);
        res.status(500);
        res.json({error});
      });
  }

  // PRIVATE

  _filterTweets(arr = []) {
    return arr
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
  }
}

module.exports = Books;
