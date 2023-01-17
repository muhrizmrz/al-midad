var express = require('express');
const collection = require('../confiq/collection');
var router = express.Router();
const fs = require('fs')
const db = require('../confiq/connection')
const objectId = require('mongodb').ObjectId

var add_article = require('../helpers/article_models')

var currentUrl = '/admin'

function authorizeAdmin(req,res,next){
  if(req.session.username){
    next()
  } else {
    currentUrl = `${req.originalUrl}`
    res.redirect('/admin/login')
  }
}

/* GET home page. */
router.get('/',authorizeAdmin, async(req, res) =>{
  let articles = await db.get().collection(collection.ARTICLE_COLLECTION).find().sort({date:-1}).toArray()
  //console.log(articles)
  res.render('admin/home',{articles:articles})
});

router.get('/login',(req,res)=>{
  if(req.session.username){
    res.redirect('/admin')
  }else {
    res.render('admin/login')
  }
})

router.post('/login',(req,res)=>{
  if(req.body.username == process.env.ADMIN_USERNAME && req.body.password == process.env.ADMIN_PASSWORD){
    req.session.username = req.body.username
    res.redirect(currentUrl)
  }else {
    res.render('admin/login',{errorMsg:"Username or password is incorrect"})
  }
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin/login')
})

/* GET new article form. */
router.get('/add-article',authorizeAdmin,(req,res)=>{
  res.render('admin/add_article')
})

/* POST new article */
router.post('/add-article',authorizeAdmin,(req,res)=>{
  add_article.addArticle(req.body).then((result)=>{
    console.log(req.files)
    if(req.files.image){
      let image  = req.files.image
      image.mv('public/article-images/'+result.insertedId.toString()+'.jpg',(err,done)=>{
        if(!err){
          console.log(result)  
        }else{
          console.log(err) 
        }
      })
    }
    res.redirect('/admin')
  })
})

/* GET view article */
router.get('/:id',authorizeAdmin,async(req,res)=>{
  var articleToBeView = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({_id:objectId(req.params.id)})
  res.render('admin/view-article',{article:articleToBeView})
})

/* GET edit aritcle page */
router.get('/edit/:id',authorizeAdmin,async(req,res)=>{
  var _id = req.params.id
  let articleToBeEdit = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({_id:objectId(_id)})
  //console.log(articleToBeEdit)
  res.render('admin/edit_article',{article:articleToBeEdit})
})

/* POST edit article */
router.post('/edit/:id',authorizeAdmin,(req,res)=>{
  add_article.updateArticle(req.params.id,req.body).then(()=>{
    var path = 'public/article-images/'+req.params.id+'.jpg'
    if(req.files){
      fs.unlink(path, function (err) {
        err ? console.error(err) : console.log("File removed:", path)
      });
      let editedImage = req.files.image
      editedImage.mv('public/article-images/'+req.params.id+'.jpg')
    }
    res.redirect('/admin/'+req.params.id)
  })
})

router.get('/delete/:id',authorizeAdmin,(req,res)=>{
  add_article.deleteArticle(req.params.id).then(()=>{
    res.redirect('/admin')
  })
})

module.exports = router;
