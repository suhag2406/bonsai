var express = require('express');
var router = express.Router();
var elasticserch = require('elasticsearch');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



// require('array.prototype.flatmap').shim()

let bonsai_url = "https://dpebpxb2xx:udlb7kfrua@suhag-1429366223.us-east-1.bonsaisearch.net:443"

//elastic search client
let elaClient = new elasticserch.Client({
  host: bonsai_url,
  ssl: { rejectUnauthorized: false, pfx: [] }
})


async function run () {
  await elaClient.indices.create({
    index: 'tweets',
    operations: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          text: { type: 'text' },
          user: { type: 'keyword' },
          time: { type: 'date' }
        }
      }
    }
  }, { ignore: [400] })

  const dataset = [{
    id: 1,
    text: 'If I fall, don\'t bring me back.',
    user: 'jon',
    date: new Date()
  }, {
    id: 2,
    text: 'Winter is coming',
    user: 'ned',
    date: new Date()
  }, {
    id: 3,
    text: 'A Lannister always pays his debts.',
    user: 'tyrion',
    date: new Date()
  }, {
    id: 4,
    text: 'I am the blood of the dragon.',
    user: 'daenerys',
    date: new Date()
  }, {
    id: 5, // change this value to a string to see the bulk response with errors
    text: 'A girl is Arya Stark of Winterfell. And I\'m going home.',
    user: 'arya',
    date: new Date()
  }]

  // const operations = dataset.flatMap(doc => [{ index: { _index: 'tweets' } }, doc])

 
  

  // const count = await elaClient.count({ index: 'tweets' })
  // console.log(count)
}

run().catch(console.log)

module.exports = router;
