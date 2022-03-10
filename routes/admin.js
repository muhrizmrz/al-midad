var express = require('express');
const collection = require('../confiq/collection');
var router = express.Router();
const db = require('../confiq/connection')
const objectId = require('mongodb').ObjectId

var add_article = require('../helpers/article_models')

/* GET home page. */
router.get('/', async(req, res) =>{
  let articles = await db.get().collection(collection.ARTICLE_COLLECTION).find().sort({date:-1}).toArray()
  //console.log(articles)
  res.render('admin/home',{articles:articles})
});

/* GET new article form. */
router.get('/add-article',(req,res)=>{
  res.render('admin/add_article')
})

/* POST new article */
router.post('/add-article',(req,res)=>{
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
router.get('/:id',async(req,res)=>{
  var articleToBeView = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({_id:objectId(req.params.id)})
  res.render('admin/view-article',{article:articleToBeView})
})

/* GET edit aritcle page */
router.get('/edit/:id',async(req,res)=>{
  var _id = req.params.id
  let articleToBeEdit = await db.get().collection(collection.ARTICLE_COLLECTION).findOne({_id:objectId(_id)})
  //console.log(articleToBeEdit)
  res.render('admin/edit_article',{article:articleToBeEdit})
})

/* POST edit article */
router.post('/edit/:id',(req,res)=>{
  add_article.updateArticle(req.params.id,req.body).then(()=>{
    res.redirect('/admin/'+req.params.id)
    let editedImage = req.files.image
    editedImage.mv('public/article-images/'+req.params.id+'.jpg')
  })
})

router.get('/delete/:id',(req,res)=>{
  add_article.deleteArticle(req.params.id).then(()=>{
    res.redirect('/admin')
  })
})

module.exports = router;
