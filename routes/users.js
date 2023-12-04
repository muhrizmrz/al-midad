var express = require('express');
var router = express.Router();
var article_helper = require('../helpers/article_models')
var news_helper = require('../helpers/news_models')
var settings_helper = require('../helpers/settings_models')
const collection = require('../config/collection');
const db = require('../config/connection');
const category_models = require('../helpers/category_models');
const objectId = require('mongodb').ObjectId

///
router.use(async (req, res, next) => {
  res.locals.nav_items = await category_models.getCategories().then((result) => {
    result = result.map(obj => {
      return { ...obj, encodedCategory: encodeURIComponent(obj.category_arabic) }
    })
    console.log(result)
    return result;
  })
  next()
})


/* GET Home Page */
router.get('/', async (req, res) => {
  //let filterArticles = await db.get().collection(collection.ARTICLE_COLLECTION).find({category:'التواريخ'}).limit(6).toArray()
  try {
    settings_helper.setDefaultSettings();
    let category = await settings_helper.getSelectedCategories().then((result) => {
      return result;
    })
    let category1Articles = await article_helper.getArticlesByCategory(category.category1.trimmed).then((result) => {
      return result;
    })
    let category2Articles = await article_helper.getArticlesByCategory(category.category2.trimmed).then((result) => {
      return result;
    })
    let news = await news_helper.getRecentNews().then((result) => {
      return result;
    })
    article_helper.getRecentArticles().then((result) => {

      res.render('index', { recentArticles: result, category1Articles, category2Articles, category, news })
    })

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



/* GET view News */
router.get('/news/:id', async (req, res) => {
  var newsToBeView = await db.get().collection(collection.NEWS_COLLECTION).findOne({ _id: objectId(req.params.id) })
  res.render('view-news', { news: newsToBeView, currentArticle: req.params.id })
})


/* GET view All */
router.get('/:category', async (req, res) => {
  let viewAll = await article_helper.getArticlesByCategory(req.params.category).then((result) => {
    return result;
  })
  let isEmpty = false;
  if(viewAll.length == 0){
    isEmpty = true;
  }
  res.render('view-all', { allArticle: viewAll, isEmpty, category: req.params.category })
})

/* GET view article */
router.get('/articles/:id', async (req, res) => {
  var articleToBeView = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({ _id: objectId(req.params.id) })
  sameTagArticles = await db.get().collection(collection.ARTICLE_COLLECTION).find().toArray()
  for (var i = 0; i < sameTagArticles.length; i++) {
    if (sameTagArticles[i]._id === req.params.id) {
      sameTagArticles.splice(i, 1);
    }
  }
  let updatedSameTagArticles = sameTagArticles.filter(item => item._id !== objectId(req.params.id))
  res.render('view-article', { article: articleToBeView, sameTagArticles: updatedSameTagArticles, currentArticle: req.params.id })
})

module.exports = router;
