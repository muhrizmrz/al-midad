const express = require("express");
const router = express.Router();
const article_helper = require("../helpers/article_models");
const news_helper = require("../helpers/news_models");
const settings_helper = require("../helpers/settings_models");
const collection = require("../config/collection");
const db = require("../config/connection");
const category_models = require("../helpers/category_models");
const objectId = require("mongodb").ObjectId;

// Passing Nav items in user Header
router.use(async (req, res, next) => {
  res.locals.nav_items = await category_models
    .getCategories()
    .then((result) => {
      result = result.map((obj) => {
        return {
          ...obj,
          encodedCategory: encodeURIComponent(obj.category_arabic),
        };
      });
      return result;
    });
  next();
});

/* GET Home Page */
router.get("/", async (req, res, next) => {
  try {
    let category = await settings_helper
      .getSelectedCategories()
      .then((result) => {
        return result;
      });
      console.log(category);
    let covers = await settings_helper.getAllCover().then((result) => {
      // if result is empty
      if (!result || !Array.isArray(result)) {
        return [];
      } else {
        return result;
      }
    });
    let noOfArticles = 3;
    let category1Articles = [];
    let category2Articles = [];
    let category1 = "";
    let category2 = "";

    if (category.category1) {
      category1 = category.category1.arabic;
      category1Articles = await article_helper
        .getArticlesByCategory(category.category1.trimmed, noOfArticles)
        .then((result) => {
          return result;
        });
    }

    if (category.category2) {
      category2 = category.category2.arabic;
      category2Articles = await article_helper
        .getArticlesByCategory(category.category2.trimmed, noOfArticles)
        .then((result) => {
          return result;
        });
    }
    let news = await news_helper.getRecentNews().then((result) => {
      return result;
    });
    article_helper.getRecentArticles().then((result) => {
      res.render("index", {
        recentArticles: result,
        covers,
        category1Articles,
        category2Articles,
        category1,
        category2,
        news,
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get('/subscriptions', async (req, res, next) => {
  try {
      res.render('admin/subscriptions')
  } catch (error){
    next(error)
  }
});

router.get("/subscribe", async (req, res, next) => {
  try {
    res.render("subscribe", { csrfToken: req.csrfToken() });
  } catch (error) {
    next(error);
  }
});
router.delete("/subscriptions/clear", async (req, res, next) => {
  try {
    await db.get().collection('subscription').deleteMany({});
    res.status(200).send("All subscriptions have been deleted successfully.");
  } catch (error) {
    console.error("Failed to delete subscriptions:", error);
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    
    const searchTerm = req.query.query;
    if (!searchTerm) {
      return res.render("search-result", { articles: [], searchTerm: '' });
    }
    const articles = await article_helper.searchArticles(searchTerm);
    res.render("search-result", { results: articles, query: searchTerm });
  } catch (error) {
    console.error("Search failed:", error);
    next(error);
  }
});



router.post("/subscribe", async (req, res, next)=> {
  try {
    const subDetails = req.body;
    console.log(subDetails)
    const subAmount = 500.00;
    //await db.get().collection(collection.SUBSCRIPTION_DETAILS).deleteMany({})
    settings_helper.addSubscribtion(subDetails,subAmount).then((result)=>{
      // result.order.amount = result.order.amount / 100;
      console.log(result);
      let amount = 500.00;
      let fee = 12.00;
      let total = amount + fee;
      // res.render('payment',{orderDetails: result.order, subDetails: subDetails, subscription_id: result.subscription_id});
      res.render('payment',{subDetails: subDetails,amount,fee,total,title: "Al Midad Subscription Portal", ogTitle: "Al Midad Subscription Portal"});
    })
  } catch (error) {
    next(error)
  }
})

router.get("/subscribe/payment-success",async(req,res,next)=> {
  try {
    res.render('payment_confirmation',{payment_id: 1234422});
  } catch(err){
    console.log(err);
    next(err);
  }
})

router.post("/subscribe/payment-success",async(req,res,next)=> {
  try {
    const { subscriptionId } = req.body;
    await settings_helper.updatePaymentStatus(subscriptionId).then((result)=>{
      res.send(result);
    })
  } catch(err){
    console.log(err);
    next(err);
  }
})

/* GET view News */
router.get("/news/:id", async (req, res, next) => {
  try {
    var newsToBeView = await db
      .get()
      .collection(collection.NEWS_COLLECTION)
      .findOne({ _id: objectId(req.params.id) });
    res.render("view-news", {
      news: newsToBeView,
      currentArticle: req.params.id,
    });
  } catch (error) {
    next(error);
  }
});

/* GET view All */
router.get("/category/:category", async (req, res, next) => {
  try {
    let viewAll = await article_helper
      .getArticlesByCategory(req.params.category, null)
      .then((result) => {
        return result;
      });
    let isEmpty = false;
    if (viewAll.length == 0) {
      isEmpty = true;
    }
    res.render("view-all", {
      allArticle: viewAll,
      isEmpty,
      category: req.params.category,
    });
  } catch (error) {
    next(error);
  }
});

/* GET view article */
router.get("/articles/:id", async (req, res, next) => {
  try {
    const aritcleId = req.params.id;
    await article_helper.IncrementArticleViewCount(aritcleId);
    let url = `https://almidad.darulhasanath.com/articles/${aritcleId};`;
    let articleToBeView = await article_helper
      .getArticleById(aritcleId)
      .then((result) => {
        if (!result.author_credential) {
          result.author_credential = "مؤلف";
        }
        return result;
      });
    sameTagArticles = await article_helper
      .getArticlesByCategory(articleToBeView.trimmedCategory, 3)
      .then((result) => {
        return result;
      });
    let updatedSameTagArticles = sameTagArticles.filter((item) => {
      return item.topic !== articleToBeView.topic;
    });
    res.render("view-article", {
      article: articleToBeView,
      sameTagArticles: updatedSameTagArticles,
      currentArticle: req.params.id,
      ogTitle: articleToBeView.topic,
      ogImage: `https://almidad.darulhasanath.com/static/article-images/${articleToBeView._id}.jpg`,
      ogUrl: `https://almidad.darulhasanath.com/articles/${articleToBeView._id}`
    });
  } catch (error) {
    next(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/editor-note", (req, res) => {
  res.render("editor-note");
});

router.get("/contact-us", (req, res) => {
  res.render("contact_us");
});

module.exports = router;
