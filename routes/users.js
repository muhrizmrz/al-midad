var express = require('express');
var router = express.Router();
var article_helper = require('../helpers/article_models')
const collection = require('../config/collection');
const db = require('../config/connection')
const objectId = require('mongodb').ObjectId

/* GET users listing. */
router.get('/', async(req, res)=> {
 // let articles = await db.get().collection(collection.ARTICLE_COLLECTION).find().sort({date:-1}).limit(3).toArray()
  let filterArticles = await db.get().collection(collection.ARTICLE_COLLECTION).find({catagory:'article'}).limit(6).toArray()
  article_helper.getRecentArticles().then((result)=>{  
    res.render('index',{recentArticles:result,filterArticles:filterArticles})
  })
});

/* GET view article */
router.get('/articles/:id',async(req,res)=>{
  var articleToBeView = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({_id:objectId(req.params.id)})
  sameTagArticles = await db.get().collection(collection.ARTICLE_COLLECTION).find().toArray()
  for (var i = 0; i < sameTagArticles.length; i++) {
    if (sameTagArticles[i]._id === req.params.id) {
      sameTagArticles.splice(i, 1);
    }
   }
  let updatedSameTagArticles = sameTagArticles.filter(item => item._id !== objectId(req.params.id))
  res.render('view-article',{article:articleToBeView,sameTagArticles:updatedSameTagArticles,currentArticle:req.params.id})
})


/* GET view All */
router.get('/view-all/:catagory',async(req,res)=>{
  let viewAll = await db.get().collection(collection.ARTICLE_COLLECTION).find({catagory:req.params.catagory}).toArray()
  res.render('view-all',{allArticle:viewAll})
}) 

module.exports = router;
