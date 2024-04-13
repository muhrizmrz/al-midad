const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const csrf = require('lusca').csrf
const article_helper = require('../helpers/article_models')
const news_helper = require('../helpers/news_models')
const settings_helper = require('../helpers/settings_models')
const collection = require('../config/collection');
const db = require('../config/connection');
const category_models = require('../helpers/category_models');
const objectId = require('mongodb').ObjectId

function authorizeAdmin(req, res, next) {
    if (req.session.username) {
      try {
        next()
      } catch (error) {
        console.log(error)
      }
    } else {
      res.redirect('/admin/login')
    }
  }

router.get('/articles',async (req,res)=>{
    let articles = await article_helper.getAllArticles()
    res.json(articles)
})

router.get('/:category', async (req, res) => {
    let articles = await article_helper.getArticlesByCategory(req.params.category, null);
    res.json(articles);
})

router.post('/admin/settings', authorizeAdmin, (req, res) => {
  try {//654dcb52bb72dabde009e88c
    settings_helper.changeCategoryInHomePage(req.body).then((result) => {
      res.json(result)
    })
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

router.post('/admin/upload-cover',authorizeAdmin,async(req,res)=>{
      settings_helper.uploadCover(req.body).then((result)=>{
        if (req.files['new-cover']) {
          let image = req.files['new-cover'];
          image.mv('public/cover-images/' + result.insertedId.toString() + '.jpg', (err, done) => {
            if (!err) {
              console.log('')
            } else {
              console.log(err)
            }
          })
        }
        res.json(req.body);
      })
  })

router.post('/admin/upload-ad',authorizeAdmin,async(req,res)=>{
      if (req.files['ad']) {
        let image = req.files['ad'];
        image.mv('public/ad-image/ad.jpg', (err, done) => {
          if (!err) {
            res.json({error:false});
          } else {
            console.log(err)
            res.json({error:true,msg:err})
          }
        })
      } 
})


// router.get('/categories', async (req,res) => {
    //     let categories = await category_models.getCategories();
    //     res.json(articles)
    // })
    
module.exports = router;