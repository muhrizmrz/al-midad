const express = require('express');
const sanitize = require('sanitize-filename')
const csrf = require('lusca').csrf
const router = express.Router();
const fs = require('fs')
const objectId = require('mongodb').ObjectId

const collection = require('../config/collection');
const db = require('../config/connection')
const article_models = require('../helpers/article_models');
const news_models = require('../helpers/news_models');
const category_models = require('../helpers/category_models');
const settings_models = require('../helpers/settings_models');
const validateAndSanitizeUrl = require('../config/urlValidator');

var currentUrl

function authorizeAdmin(req, res, next) {
  if (req.session.username) {
    try {
      next()
    } catch (error) {
      console.log(error)
    }
  } else {
    currentUrl = req.originalUrl
    currentUrl = validateAndSanitizeUrl(currentUrl)
    res.redirect('/admin/login')
  }
}


// GET login Page
router.get('/login', (req, res) => {
  if (req.session.username) {
    res.redirect('/admin')
  } else {
    if (currentUrl == '/admin/login') {
      currentUrl = '/admin'
    }
    res.render('admin/login', { csrfToken: req.csrfToken() })
  }
})

// POST Login operation
router.post('/login', csrf(), (req, res) => {
  try {
    if (req.body.username == process.env.ADMIN_USERNAME && req.body.password == process.env.ADMIN_PASSWORD) {
      req.session.username = req.body.username
      res.redirect(currentUrl || '/admin')
    } else {
      res.render('admin/login', { errorMsg: "Username or password is incorrect" })
    }
  } catch (error) {
    console.error(error)
    res.status(403);
  }

})

// GET Logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin/login')
})

/* GET home page. */
router.get('/', authorizeAdmin, async (req, res) => {
  settings_models.setDefaultSettings().then(() => {
    res.render('admin/home',)
  })
});

// GET Article page
router.get('/article', authorizeAdmin, async (req, res) => {
  let articles = await db.get().collection(collection.ARTICLE_COLLECTION).find().sort({ date: -1 }).toArray()
  res.render('admin/articles', { articles })
});

// GET News page
router.get('/news', authorizeAdmin, async (req, res) => {
  let news = await db.get().collection(collection.NEWS_COLLECTION).find().sort({ date: -1 }).toArray()
  res.render('admin/news', { news })
});

// GET Category page
router.get('/category', authorizeAdmin, async (req, res) => {
  let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray();
  res.render('admin/category', { categories, csrfToken: req.csrfToken() })
})

router.post('/category/add', authorizeAdmin, (req, res) => {
  try {
    category_models.addCategory(req.body).then((result) => {
      res.redirect('/admin/category')
    })
  } catch (error) {
    console.error(error)
    res.send("Internal Error")
  }
})


router.get('/category/edit/:id', authorizeAdmin, async (req, res) => {
  var id = req.params.id
  let category = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({ _id: objectId(id) })
  res.render('admin/edit_category', { category, csrfToken: req.csrfToken() })
})

router.post('/category/edit/:id', authorizeAdmin, (req, res) => {
  try {
    category_models.editCategory(req.params.id, req.body).then((result) => {
      res.redirect('/admin/category')
    })
  } catch (error) {
    console.error(error)
    res.send("Internal Error")
  }
})



// GET Settings page
router.get('/settings', authorizeAdmin, async (req, res) => {
  try {
    let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
    let selectedCategory = await settings_models.getSelectedCategories().then((result) => {
      return result;
    })

    let category1 = selectedCategory.category1;
    let category2 = selectedCategory.category2;
    res.render('admin/settings', { category1, category2, categories, csrfToken: req.csrfToken() });

  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).send('Internal Server Error');

  }
})


router.post('/settings', authorizeAdmin, (req, res) => {
  try {
    settings_models.changeCategoryInHomePage(req.body).then((result) => {
      res.redirect('/admin/settings')
    })
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

/* GET add news form. */
router.get('/news/add-news', authorizeAdmin, (req, res) => {
  res.render('admin/add_news', { csrfToken: req.csrfToken() })
})

/* POST new News */
router.post('/news/add-news', authorizeAdmin, (req, res) => {
  news_models.addNews(req.body).then((result) => {
    if (req.files.image) {
      let image = req.files.image
      image.mv('public/news-images/' + result.insertedId.toString() + '.jpg', (err, done) => {
        if (!err) {
          console.log(result)
        } else {
          console.log(err)
        }
      })
    }
    res.redirect('/admin')
  })
})

/* GET view news */
router.get('/news/:id', authorizeAdmin, async (req, res) => {
  var newsToBeView = await db.get().collection(collection.NEWS_COLLECTION).findOne({ _id: objectId(req.params.id) })
  res.render('admin/view-news', { news: newsToBeView })
})

/* GET edit news page */
router.get('/news/edit/:id', authorizeAdmin, async (req, res) => {
  var _id = req.params.id
  let newsToBeEdit = await db.get().collection(collection.NEWS_COLLECTION).findOne({ _id: objectId(_id) })
  res.render('admin/edit_news', { news: newsToBeEdit, csrfToken: req.csrfToken() })
})

/* POST edit news */
router.post('/news/edit/:id', authorizeAdmin, (req, res) => {
  try {
    news_models.updateNews(req.params.id, req.body).then(() => {
      var sanitizedId = sanitize(req.params.id)
      var path = 'public/news-images/' + sanitizedId + '.jpg'
      if (req.files) {
        fs.unlink(path, function (err) {
          err ? console.error(err) : console.log("File removed:", path)
        });
        let editedImage = req.files.image
        editedImage.mv(path)
      }
      res.redirect('/admin/news/' + sanitizedId)
    })
  } catch (error) {
    res.status(403)
    console.log(error)
  }

})

router.get('/news/delete/:id', authorizeAdmin, (req, res) => {
  news_models.deleteNews(req.params.id).then(() => {
    res.redirect('/admin')
  })
})

/* GET new article form. */
router.get('/article/add-article', authorizeAdmin, (req, res) => {
  category_models.getCategories().then((result) => {
    res.render('admin/add_article', { categories: result, csrfToken: req.csrfToken() })
  })
})

/* POST new article */
router.post('/article/add-article', authorizeAdmin, (req, res) => {
  article_models.addArticle(req.body).then((result) => {
    console.log(req.files)
    if (req.files.image) {
      let image = req.files.image
      image.mv('public/article-images/' + result.insertedId.toString() + '.jpg', (err, done) => {
        if (!err) {
          console.log(result)
        } else {
          console.log(err)
        }
      })
    }
    res.redirect('/admin')
  })
})

/* GET view article */
router.get('/article/:id', authorizeAdmin, async (req, res) => {
  var articleToBeView = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({ _id: objectId(req.params.id) })
  res.render('admin/view-article', { article: articleToBeView })
})

/* GET edit aritcle page */
router.get('/article/edit/:id', authorizeAdmin, async (req, res) => {
  var _id = req.params.id
  let articleToBeEdit = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({ _id: objectId(_id) })
  category_models.getCategories().then((result) => {
    res.render('admin/edit_article', { categories: result, article: articleToBeEdit, csrfToken: req.csrfToken() })
  })
})

/* POST edit article */
router.post('/article/edit/:id', authorizeAdmin, (req, res) => {
  try {
    article_models.updateArticle(req.params.id, req.body).then(() => {
      var sanitizedId = sanitize(req.params.id)
      var path = 'public/article-images/' + sanitizedId + '.jpg'
      if (req.files) {
        fs.unlink(path, function (err) {
          err ? console.error(err) : console.log("File removed:", path)
        });
        let editedImage = req.files.image
        editedImage.mv(path)
      }
      res.redirect('/admin/article/' + sanitizedId)
    })
  } catch (error) {
    res.status(403)
    console.log(error)
  }

})

router.get('/article/delete/:id', authorizeAdmin, (req, res) => {
  article_models.deleteArticle(req.params.id).then(() => {
    res.redirect('/admin')
  })
})






module.exports = router;
