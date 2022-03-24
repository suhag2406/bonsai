var express = require('express');
var router = express.Router();
var elasticserch = require('elasticsearch');
var contentful = require('contentful');

const async = require('hbs/lib/async');

let bonsai_url = "https://dpebpxb2xx:udlb7kfrua@suhag-1429366223.us-east-1.bonsaisearch.net:443"

//elastic search client
let elaClient = new elasticserch.Client({
  host: bonsai_url,
  ssl: { rejectUnauthorized: false, pfx: [] }
})

//contentful client
var contentfulClient = contentful.createClient({
  space: 'v70n7ohznxv1',
  accessToken: 'ItuAdR5ym1LKoGNE-oLZyG1cUeL05adW9u3TgkzMdOI'
});

elaClient.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    console.log("elastic server is down ")
  } else {
    console.log("all is well...");
  }
})



// contentfulClient
//     .getEntries({ content_type: 'blogPost' })
//     .then((entries) => {
//       let listBlog = entries.items.map((blog) => {

//         return { id: blog.sys.id, title: blog.fields.title }
//       })
//       console.log(listBlog)
//       // res.render('try1', { listBlog, blog: entries.items[0].fields })
//     })
//     .catch(err => console.log(err))





//indexing hear 
router.get('/', async (req, res, next) => {
  const responce = await elaClient.index({
    index: 'myindex',
    type: 'mytype',
    id: '3',
    body: {
      title: "test two",
      tages: ["cat", "dog"],
      blogname: "first blog",
      published: true
    }
  })

  res.json(responce)
})


router.get('/contentfulData', async (req, res, next) => {

  let bloglist = await contentfulClient.getEntries({ content_type: 'blogPost' });

  let listBlog =  bloglist.items.map((blog) => {
    return { id: blog.sys.id, title: blog.fields.title }
  })




  listBlog.map(async function (data) {
    const responce = await elaClient.index({
      index: 'contentfuldata',
      type: 'mytype',
      id: data.id,
      body: {
        title: data.title
      }

    })
    res.json(responce)
  })
  
  console.log("working");
})




router.get('/serch', async (req, res, next) => {
  let q = req.query.q
  console.log(q, "this qurey is passed");
  const reasponse = await elaClient.search({
    index: "myindex",
    q: q
  })
  console.log(reasponse.hits.hits);
  res.json(reasponse.hits.hits)
})



module.exports = router;
