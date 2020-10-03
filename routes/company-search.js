const elasticsearch = require('../lib/elasticsearch.js');

//  "/company/search?q="

module.exports = async (req, res) => {

    const queryInput = req.query.q;
    const searchResults = await elasticsearch.search_companies(queryInput);

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    });

    const results = searchResults.map(result => (
        {
            score: result._score,
            ticker: result._source.ticker,
            name: result._source.name
        }
    ));

    res.send(results);
};