const elasticsearch = require('../lib/elasticsearch.js');

//  "/search?q="

module.exports = async (req, res) => {

    const queryInput = req.query.q;
    const searchResults = await elasticsearch.search(queryInput);

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    });

    let tickers = [];
    const results = searchResults
      .map(result => {
        const ticker = result._source.ticker;

        if (tickers.includes(ticker)) {
          return undefined;
        }

        tickers.push(ticker);
        
        return {
          resultIndex: result._index,
          ticker: ticker,
          name: result._source.name
        };
      })
      .filter(function (item) {
        return item !== undefined;
      });

    res.send({data: results});
};
