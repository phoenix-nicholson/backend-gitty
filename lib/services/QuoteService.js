const fetch = require('cross-fetch');

module.exports = class Quotes {
  static getQuotes() {
    const quoteArray = [
      'https://futuramaapi.herokuapp.com/api/quotes/1',
      'https://api.quotable.io/random',
      'https://programming-quotes-api.herokuapp.com/quotes/random',
    ];

    const promiseArray = quoteArray.map((api) => fetch(api));
    return Promise.all(promiseArray)
      .then((resp) => {
        console.log('resp', resp);
        return Promise.all(resp.map((item) => item.json()));
      })
      .then((quoteArray) => {
        console.log('quoteArray', quoteArray);
        return quoteArray.flat().map((item) => {
          if (item.success) {
            return {
              author: item.contents.quotes[0].author,
              content: item.contents.quotes[0].content,
            };
          } else if (item.author) {
            return { author: item.author, content: item.content || item.en };
          } else {
            return {
              author: item.character,
              content: item.quote,
            };
          }
        });
      });
  }
};
