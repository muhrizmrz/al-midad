const express = require('express');
const router = express.Router();
const article_helper = require('../helpers/article_models')
const news_helper = require('../helpers/news_models')
const settings_helper = require('../helpers/settings_models')
const collection = require('../config/collection');
const db = require('../config/connection');
const category_models = require('../helpers/category_models');
const objectId = require('mongodb').ObjectId

// Passing Nav items in user Header
router.use(async (req, res, next) => {
  res.locals.nav_items = await category_models.getCategories().then((result) => {
    result = result.map(obj => {
      return { ...obj, encodedCategory: encodeURIComponent(obj.category_arabic) }
    })
    return result;
  })
  next()
})


/* GET Home Page */
router.get('/', async (req, res, next) => {
  try {
    let category = await settings_helper.getSelectedCategories().then((result) => {
      return result;
    })
    let covers = await settings_helper.getAllCover().then((result) => {
      // if result is empty
      if (!result || !Array.isArray(result)) {
        return [];
      } else {
        return result;
      }
    })
    let noOfArticles = 4;
    let category1Articles = await article_helper.getArticlesByCategory(category.category1.trimmed, noOfArticles).then((result) => {
      return result;
    })
    let category2Articles = await article_helper.getArticlesByCategory(category.category2.trimmed, noOfArticles).then((result) => {
      return result;
    })
    let news = await news_helper.getRecentNews().then((result) => {
      return result;
    })
    article_helper.getRecentArticles().then((result) => {
      res.render('index', { recentArticles: result, covers, category1Articles, category2Articles, category, news })
    })

  } catch (error) {
    next(error)
  }
});



/* GET view News */
router.get('/news/:id', async (req, res, next) => {
  try {

  } catch (error) {
    next(error)
  }
  var newsToBeView = await db.get().collection(collection.NEWS_COLLECTION).findOne({ _id: objectId(req.params.id) })
  res.render('view-news', { news: newsToBeView, currentArticle: req.params.id })
})


/* GET view All */
router.get('/category/:category', async (req, res, next) => {
  try {
    let viewAll = await article_helper.getArticlesByCategory(req.params.category, null).then((result) => {
      return result;
    })
    let isEmpty = false;
    if (viewAll.length == 0) {
      isEmpty = true;
    }
    res.render('view-all', { allArticle: viewAll, isEmpty, category: req.params.category })
  } catch (error) {
    next(error)
  }
})


/* GET view article */
router.get('/articles/:id', async (req, res, next) => {
  try {
    const aritcleId = req.params.id
    await article_helper.IncrementArticleViewCount(aritcleId);
    let url = `https://almidad.darulhasanath.com/articles/${aritcleId};`
    let articleToBeView = await article_helper.getArticleById(aritcleId).then((result) => {
      if (!result.author_credential) {
        result.author_credential = 'مؤلف';
      }
      return result;
    })
    sameTagArticles = await article_helper.getArticlesByCategory(articleToBeView.trimmedCategory, 6).then((result) => {
      return result;
    })
    let updatedSameTagArticles = sameTagArticles.filter(item => {
      return item.topic !== articleToBeView.topic;
    });
    res.render('view-article', { 
      article: articleToBeView, 
      sameTagArticles: updatedSameTagArticles, 
      currentArticle: req.params.id,
      ogTitle: articleToBeView.topic, 
      ogImage: `/static/article-images/${articleToBeView._id}.jpg`
    })
  } catch (error) {
    next(error)
  }
})

router.get('/about',(req,res)=>{
  res.render("about");
})

router.get('/editor-note',(req,res)=>{
  res.render("editor-note");
})

router.get('/contact-us',(req,res)=>{
  res.render("contact_us");
})

module.exports = router;
