const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

// deprecated
async function search_companies(q) {

    let hits;

    try {
        const result = await client.search({
            index: 'companies',
            body: {
                query: {
                    multi_match: {
                        query: q,
                        type: "phrase_prefix",
                        fields: ["ticker", "name"]
                    }
                }
            }
        });
        hits = result.body.hits.hits;
    } catch (e) {
        console.error(e.detail || e.message || e);
    }

    return hits || [];
}

async function search(q) {

    let hits;

    try {
        const result = await client.search({
            index: ['companies', 'funds'],
            body: {
                query: {
                    multi_match: {
                        query: q,
                        type: "phrase_prefix",
                        fields: ["ticker", "name"]
                    }
                }
            }
        });
        hits = result.body.hits.hits;
    } catch (e) {
        console.error(e.detail || e.message || e);
    }

    return hits || [];
}
  
  module.exports = {
    search_companies,
    search,
  };